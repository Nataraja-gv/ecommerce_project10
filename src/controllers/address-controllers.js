const addressModel = require("../models/addressSchema");
const UserModel = require("../models/user-model");

const postAddress = async (req, res) => {
  try {
    const user = req.user;
    const userID = user._id;
    const validCustomer = await UserModel.findById(userID);
    if (!validCustomer) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      delivery_customer_name,
      delivery_phone_number,
      delivery_address,
      location,
    } = req.body;

    if (
      !delivery_customer_name ||
      !delivery_phone_number ||
      !delivery_address ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = {
      delivery_customer_name,
      delivery_phone_number,
      delivery_address,
      location: {
        type: location.type,
        coordinates: location.coordinates,
      },
      selected_address: true,
    };

    let addressDoc = await addressModel.findOne({ customerID: userID });

    if (addressDoc) {
      // unselect all existing addresses
      addressDoc.addresses.forEach((addr) => {
        addr.selected_address = false;
      });

      // add new address
      addressDoc.addresses.push(newAddress);
    } else {
      addressDoc = new addressModel({
        customerID: userID,
        addresses: [newAddress],
      });
    }

    await addressDoc.save();

    res.status(201).json({ message: "Address added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const putAddress = async (req, res) => {
  try {
    const user = req.user;
    const addresId = req.params.addressId;

    const userID = user._id;
    const validCustomer = await UserModel.findById(userID);
    if (!validCustomer) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressDoc = await addressModel.findOne({ customerID: userID });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }
    const addressToUpdate = addressDoc.addresses.id(addresId);

    if (!addressToUpdate) {
      return res.status(404).json({ message: "Address not found" });
    }
    const {
      delivery_customer_name,
      delivery_phone_number,
      delivery_address,
      location,
    } = req.body;
    if (delivery_customer_name)
      addressToUpdate.delivery_customer_name = delivery_customer_name;
    if (delivery_phone_number)
      addressToUpdate.delivery_phone_number = delivery_phone_number;
    if (delivery_address) addressToUpdate.delivery_address = delivery_address;
    if (location)
      addressToUpdate.location = {
        type: location.type,
        coordinates: location.coordinates,
      };
    await addressDoc.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAdress = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const addressId = req.params.addressId;

    const validCustomer = await UserModel.findById(userId);
    if (!validCustomer) {
      return res.status(404).json({ message: "User not found" });
    }
    const addressDoc = await addressModel.findOne({
      customerID: userId,
    });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }
    const addressToDelete = addressDoc.addresses.id(addressId);
    if (!addressToDelete) {
      return res.status(404).json({ message: "Address not found" });
    }

    addressToDelete.deleteOne();

    await addressDoc.save();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCustmerAddresses = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const validCustomer = await UserModel.findById(userId);
    if (!validCustomer) {
      return res.status(404).json({ message: "User not found" });
    }
    const addressDoc = await addressModel.findOne({
      customerID: userId,
    });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }
    res.status(200).json({ addresses: addressDoc.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const selectedAddress = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const addressId = req.params.addressId;
    console.log("addressId", addressId);

    // Check if user exists
    const validCustomer = await UserModel.findById(userId);

    if (!validCustomer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's address document
    const addressDoc = await addressModel.findOne({ customerID: userId });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }

    if (addressDoc) {
      addressDoc.addresses.forEach((addr) => {
        addr.selected_address = false;
      });
    }
    // Find the address by ID and mark as selected
    const selectedAddr = addressDoc.addresses.id(addressId);
    if (!selectedAddr) {
      return res.status(404).json({ message: "Address not found" });
    }
    selectedAddr.selected_address = true;

    // Save changes
    await addressDoc.save();

    res.status(200).json({ message: "Address selected successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  postAddress,
  putAddress,
  deleteAdress,
  getAllCustmerAddresses,
  selectedAddress,
};
