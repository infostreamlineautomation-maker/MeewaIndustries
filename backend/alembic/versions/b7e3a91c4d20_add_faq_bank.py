"""Add FAQ bank and placements

Revision ID: b7e3a91c4d20
Revises: 8c1d2f4a9b3e
Create Date: 2026-10-15 12:00:00.000000

Moves the FAQs that used to live in the landing_faqs / product_faqs site
settings (or the hardcoded fallbacks when those were empty) into the new
FAQ bank, placed on the same pages they were shown on before.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7e3a91c4d20'
down_revision: Union[str, Sequence[str], None] = '8c1d2f4a9b3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


DEFAULT_GENERAL_FAQS = [
    {"question": "What products do you manufacture?", "answer": "Detailed answer for \"What products do you manufacture?\" will be added here. Our team is always ready to provide comprehensive support for your specific needs."},
    {"question": "Do you offer custom printing?", "answer": "Yes, we offer custom printing on many of our packaging products to help your brand stand out."},
    {"question": "What is your minimum order quantity?", "answer": "Our minimum order quantity varies by product. Please contact our sales team for detailed information."},
    {"question": "Which countries do you export to?", "answer": "We export globally to many countries across North America, Europe, Asia, and the Middle East."},
    {"question": "Can I request product samples?", "answer": "Yes, product samples are available upon request to ensure quality meets your standards before bulk ordering."},
    {"question": "How long does production take?", "answer": "Production time typically ranges from 15 to 30 days depending on the product, customization, and order volume."},
    {"question": "How can I request a quote?", "answer": "You can request a quote by filling out the form on our Contact Us page or by directly emailing our sales team."},
]

DEFAULT_PRODUCT_FAQS = [
    {"question": "Can I customize products?", "answer": "Yes, we offer full customization including size, printing, and material specifications for most products."},
    {"question": "What is MOQ?", "answer": "The Minimum Order Quantity depends on the specific product. Please contact us for the exact MOQ for this item."},
    {"question": "Do you provide samples?", "answer": "Yes, we provide samples for quality checking before you place a bulk order."},
]


def _live_value(value):
    """Settings are stored as {"draft": ..., "published": ...}; prefer what is live."""
    if isinstance(value, dict) and ("draft" in value or "published" in value):
        return value.get("published") or value.get("draft")
    return value


def _clean(items):
    if not isinstance(items, list):
        return []
    return [
        {"question": str(i.get("question", "")).strip(), "answer": str(i.get("answer", "")).strip()}
        for i in items
        if isinstance(i, dict) and str(i.get("question", "")).strip()
    ]


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    # The tables may already exist if the app created them via Base.metadata.create_all()
    existing = sa.inspect(bind)

    if not existing.has_table('faqs'):
        op.create_table(
            'faqs',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('question', sa.String(), nullable=True),
            sa.Column('answer', sa.String(), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_faqs_id'), 'faqs', ['id'], unique=False)

    if not existing.has_table('faq_placements'):
        op.create_table(
            'faq_placements',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('faq_id', sa.Integer(), nullable=True),
            sa.Column('location', sa.String(), nullable=True),
            sa.Column('sequence', sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(['faq_id'], ['faqs.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_faq_placements_id'), 'faq_placements', ['id'], unique=False)
        op.create_index(op.f('ix_faq_placements_faq_id'), 'faq_placements', ['faq_id'], unique=False)
        op.create_index(op.f('ix_faq_placements_location'), 'faq_placements', ['location'], unique=False)

    faqs = sa.table('faqs', sa.column('id', sa.Integer), sa.column('question', sa.String), sa.column('answer', sa.String), sa.column('is_active', sa.Boolean))
    placements = sa.table('faq_placements', sa.column('faq_id', sa.Integer), sa.column('location', sa.String), sa.column('sequence', sa.Integer))

    # --- Data migration from the old settings-based FAQs (only into an empty FAQ bank) ---
    if bind.execute(sa.select(sa.func.count()).select_from(faqs)).scalar():
        return
    site_settings = sa.table('site_settings', sa.column('key', sa.String), sa.column('value', sa.JSON))
    rows = bind.execute(
        sa.select(site_settings.c.key, site_settings.c.value).where(site_settings.c.key.in_(['landing_faqs', 'product_faqs']))
    ).fetchall()
    stored = {key: _clean(_live_value(value)) for key, value in rows}

    general = stored.get('landing_faqs') or DEFAULT_GENERAL_FAQS
    product = stored.get('product_faqs') or DEFAULT_PRODUCT_FAQS

    ids_by_question = {}

    def faq_id(item):
        key = item["question"].lower()
        if key not in ids_by_question:
            ids_by_question[key] = bind.execute(
                faqs.insert().values(question=item["question"], answer=item["answer"], is_active=True).returning(faqs.c.id)
            ).scalar()
        return ids_by_question[key]

    # landing_faqs were shown on the home, about and products listing pages
    for location in ['landing', 'about', 'products']:
        for seq, item in enumerate(general):
            bind.execute(placements.insert().values(faq_id=faq_id(item), location=location, sequence=seq))
    for seq, item in enumerate(product):
        bind.execute(placements.insert().values(faq_id=faq_id(item), location='product_default', sequence=seq))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_faq_placements_location'), table_name='faq_placements')
    op.drop_index(op.f('ix_faq_placements_faq_id'), table_name='faq_placements')
    op.drop_index(op.f('ix_faq_placements_id'), table_name='faq_placements')
    op.drop_table('faq_placements')
    op.drop_index(op.f('ix_faqs_id'), table_name='faqs')
    op.drop_table('faqs')
