from sqlalchemy.orm import Session
import models

def get_db_settings_dict(db: Session) -> dict:
    """
    Fetches all SiteSettings from the DB and returns them as a dictionary.
    Handles the case where values are stored as {"draft": val, "published": val} or just val.
    It returns the 'published' value if available, otherwise 'draft', otherwise the raw value.
    """
    smtp_settings = {}
    db_settings = db.query(models.SiteSetting).all()
    for s in db_settings:
        val = s.value
        if isinstance(val, dict):
            if "published" in val and val["published"] is not None:
                smtp_settings[s.key] = val["published"]
            elif "draft" in val:
                smtp_settings[s.key] = val["draft"]
            else:
                smtp_settings[s.key] = val
        else:
            smtp_settings[s.key] = val
    return smtp_settings
