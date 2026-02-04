from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# PostgreSQL config
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:negg@localhost:5432/asset_management"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

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
    data = request.json

    asset = Asset(
        asset_id=data["assetIdentification"]["assetId"],
        barcode=data["assetIdentification"]["barcode"],
        asset_type=data["assetIdentification"]["assetType"],
        parent_asset_id=data["assetIdentification"]["parentAssetId"],
        serial_number=data["assetIdentification"]["serialNumber"],

        account_head=data["classification"]["accountHead"],
        category=data["classification"]["category"],
        sub_category=data["classification"]["subCategory"],
        asset_group=data["classification"]["assetGroup"],
        asset_model=data["classification"]["assetModel"],
        manufacturer=data["classification"]["manufacturer"],

        asset_name=data["coreDetails"]["assetName"],
        purchase_date=data["coreDetails"]["purchaseDate"],
        capitalization_date=data["coreDetails"]["capitalizationDate"],
        vendor=data["coreDetails"]["vendor"],
        invoice_number=data["coreDetails"]["invoiceNumber"],
        asset_value=data["coreDetails"]["assetValue"],
        warranty_start=data["coreDetails"]["warrantyStart"],
        warranty_end=data["coreDetails"]["warrantyEnd"],
        amc_applicable=data["coreDetails"]["amcApplicable"],

        cpu=data["specificDetails"].get("cpu"),
        ram=data["specificDetails"].get("ram"),
        storage=data["specificDetails"].get("storage"),
        os=data["specificDetails"].get("os"),
        ip_address=data["specificDetails"].get("ipAddress"),
        mac_address=data["specificDetails"].get("macAddress"),
        hostname=data["specificDetails"].get("hostname"),
        software_license=data["specificDetails"].get("softwareLicense"),

        dimensions=data["specificDetails"].get("dimensions"),
        capacity=data["specificDetails"].get("capacity"),
        material_type=data["specificDetails"].get("materialType"),
        power_rating=data["specificDetails"].get("powerRating"),
        installation_date=data["specificDetails"].get("installationDate"),

        department=data["assignment"]["department"],
        cost_center=data["assignment"]["costCenter"],
        location=data["assignment"]["location"],
        sub_location=data["assignment"]["subLocation"],
        assigned_to=data["assignment"]["assignedTo"],
        custodian=data["assignment"]["custodian"],

        asset_status=data["status"]["assetStatus"],
        verification_status=data["status"]["verificationStatus"],
        verification_cycle=data["status"]["verificationCycle"],
        remarks=data["status"]["remarks"],

        latitude=data["metadata"]["gpsCoordinates"]["latitude"] if data["metadata"]["gpsCoordinates"] else None,
        longitude=data["metadata"]["gpsCoordinates"]["longitude"] if data["metadata"]["gpsCoordinates"] else None,
        accuracy=data["metadata"]["gpsCoordinates"]["accuracy"] if data["metadata"]["gpsCoordinates"] else None,

        captured_by=data["metadata"]["capturedBy"],
        captured_at_location=data["metadata"]["capturedAtLocation"]
    )

    db.session.add(asset)

    for img in data["images"]:
        image = AssetImage(
            asset_id=data["assetIdentification"]["assetId"],
            image_index=img["imageIndex"],
            image_data=img["imageData"],
            captured_at=img["capturedAt"]
        )
        db.session.add(image)

    db.session.commit()

    return jsonify({"message": "Asset saved successfully"}), 201


if __name__ == "__main__":
    app.run(debug=True)
