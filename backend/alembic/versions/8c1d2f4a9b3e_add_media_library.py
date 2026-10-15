"""Add media library

Revision ID: 8c1d2f4a9b3e
Revises: 5e94b4abb0f7
Create Date: 2026-10-13 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c1d2f4a9b3e'
down_revision: Union[str, Sequence[str], None] = '5e94b4abb0f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # The table may already exist if the app created it via Base.metadata.create_all()
    if sa.inspect(op.get_bind()).has_table('media'):
        return
    op.create_table(
        'media',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(), nullable=True),
        sa.Column('filename', sa.String(), nullable=True),
        sa.Column('original_name', sa.String(), nullable=True),
        sa.Column('alt_text', sa.String(), nullable=True),
        sa.Column('mime_type', sa.String(), nullable=True),
        sa.Column('size', sa.Integer(), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_media_id'), 'media', ['id'], unique=False)
    op.create_index(op.f('ix_media_url'), 'media', ['url'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_media_url'), table_name='media')
    op.drop_index(op.f('ix_media_id'), table_name='media')
    op.drop_table('media')
