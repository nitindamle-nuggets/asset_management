from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, date
import os

app = Flask(__name__)
CORS(app)

# PostgreSQL config
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:AssetApp123@asset-app-db.c3c2c4ko25fv.ap-south-1.rds.amazonaws.com:5432/postgres"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---------------- HELPERS ----------------

def _parse_date(value):
    if not value:
        return None
    if isinstance(value, (date, datetime)):
        return value.date() if isinstance(value, datetime) else value
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        return None


def _parse_datetime(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None

# ---------------- MODELS ----------------

class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)

    asset_id = db.Column(db.String(100))
    barcode = db.Column(db.String(100))
    asset_type = db.Column(db.String(20))
    parent_asset_id = db.Column(db.String(100))
    serial_number = db.Column(db.String(100))

    account_head = db.Column(db.String(100))
    category = db.Column(db.String(100))
    sub_category = db.Column(db.String(100))
    asset_group = db.Column(db.String(100))
    asset_model = db.Column(db.String(100))
    manufacturer = db.Column(db.String(100))

    asset_name = db.Column(db.Text)
    purchase_date = db.Column(db.Date)
    capitalization_date = db.Column(db.Date)
    vendor = db.Column(db.String(150))
    invoice_number = db.Column(db.String(100))
    asset_value = db.Column(db.Numeric)
    warranty_start = db.Column(db.Date)
    warranty_end = db.Column(db.Date)
    amc_applicable = db.Column(db.Boolean)

    cpu = db.Column(db.String(100))
    ram = db.Column(db.String(100))
    storage = db.Column(db.String(100))
    os = db.Column(db.String(100))
    ip_address = db.Column(db.String(50))
    mac_address = db.Column(db.String(50))
    hostname = db.Column(db.String(100))
    software_license = db.Column(db.Text)

    dimensions = db.Column(db.String(100))
    capacity = db.Column(db.String(100))
    material_type = db.Column(db.String(100))
    power_rating = db.Column(db.String(100))
    installation_date = db.Column(db.Date)

    department = db.Column(db.String(100))
    cost_center = db.Column(db.String(100))
    location = db.Column(db.String(100))
    sub_location = db.Column(db.String(100))
    assigned_to = db.Column(db.String(100))
    custodian = db.Column(db.String(100))

    asset_status = db.Column(db.String(50))
    verification_status = db.Column(db.String(50))
    verification_cycle = db.Column(db.String(50))
    remarks = db.Column(db.Text)

    latitude = db.Column(db.Numeric)
    longitude = db.Column(db.Numeric)
    accuracy = db.Column(db.Numeric)

    captured_by = db.Column(db.String(100))
    captured_at_location = db.Column(db.String(150))


class AssetImage(db.Model):
    __tablename__ = "asset_images"

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.String(100))
    image_index = db.Column(db.Integer)
    image_data = db.Column(db.Text)
    captured_at = db.Column(db.DateTime)

# ---------------- API ----------------

@app.route("/api/assets", methods=["POST"])
def create_asset():
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({"error": "Invalid or empty JSON payload"}), 400

    asset_identification = data.get("assetIdentification") or {}
    classification = data.get("classification") or {}
    core_details = data.get("coreDetails") or {}
    specific_details = data.get("specificDetails") or {}
    assignment = data.get("assignment") or {}
    status = data.get("status") or {}
    metadata = data.get("metadata") or {}
    gps = metadata.get("gpsCoordinates") or {}

    asset = Asset(
        asset_id=asset_identification.get("assetId"),
        barcode=asset_identification.get("barcode"),
        asset_type=asset_identification.get("assetType"),
        parent_asset_id=asset_identification.get("parentAssetId"),
        serial_number=asset_identification.get("serialNumber"),

        account_head=classification.get("accountHead"),
        category=classification.get("category"),
        sub_category=classification.get("subCategory"),
        asset_group=classification.get("assetGroup"),
        asset_model=classification.get("assetModel"),
        manufacturer=classification.get("manufacturer"),

        asset_name=core_details.get("assetName"),
        purchase_date=_parse_date(core_details.get("purchaseDate")),
        capitalization_date=_parse_date(core_details.get("capitalizationDate")),
        vendor=core_details.get("vendor"),
        invoice_number=core_details.get("invoiceNumber"),
        asset_value=core_details.get("assetValue"),
        warranty_start=_parse_date(core_details.get("warrantyStart")),
        warranty_end=_parse_date(core_details.get("warrantyEnd")),
        amc_applicable=core_details.get("amcApplicable"),

        cpu=specific_details.get("cpu"),
        ram=specific_details.get("ram"),
        storage=specific_details.get("storage"),
        os=specific_details.get("os"),
        ip_address=specific_details.get("ipAddress"),
        mac_address=specific_details.get("macAddress"),
        hostname=specific_details.get("hostname"),
        software_license=specific_details.get("softwareLicense"),

        dimensions=specific_details.get("dimensions"),
        capacity=specific_details.get("capacity"),
        material_type=specific_details.get("materialType"),
        power_rating=specific_details.get("powerRating"),
        installation_date=_parse_date(specific_details.get("installationDate")),

        department=assignment.get("department"),
        cost_center=assignment.get("costCenter"),
        location=assignment.get("location"),
        sub_location=assignment.get("subLocation"),
        assigned_to=assignment.get("assignedTo"),
        custodian=assignment.get("custodian"),

        asset_status=status.get("assetStatus"),
        verification_status=status.get("verificationStatus"),
        verification_cycle=status.get("verificationCycle"),
        remarks=status.get("remarks"),

        latitude=gps.get("latitude"),
        longitude=gps.get("longitude"),
        accuracy=gps.get("accuracy"),

        captured_by=metadata.get("capturedBy"),
        captured_at_location=metadata.get("capturedAtLocation")
    )

    db.session.add(asset)

    for img in data.get("images") or []:
        image = AssetImage(
            asset_id=asset_identification.get("assetId"),
            image_index=img.get("imageIndex"),
            image_data=img.get("imageData"),
            captured_at=_parse_datetime(img.get("capturedAt"))
        )
        db.session.add(image)
    try:
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return jsonify({"error": "Failed to save asset", "details": str(exc)}), 500

    return jsonify({"message": "Asset saved successfully"}), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
