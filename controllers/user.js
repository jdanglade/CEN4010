const mongodbConnection = require("../dbconfig/connection.js");
const { ObjectID } = require('mongodb');

/**
Some helpful resources!
https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/
https://docs.mongodb.com/manual/reference/method/db.collection.find/
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/

data - passed to API calls in EditProfileComponent
https://github.com/FultonG/CEN4010/blob/development/client/src/components/profile_management/EditProfileComponent.jsb
cb - callback passed in api file
https://github.com/FultonG/CEN4010/blob/development/routes/api/user.js
*/

const user = {
    getUser: (data, cb) => {
        const collection = mongodbConnection.db().collection("User");
        collection.findOne({ email: data.email }, (findError, findResult) => {
            if (findResult) {
                // Ignore password and object id fields from findResult object
                const {password, _id, ...rest} = findResult;
                cb(200, rest);
            }
            else {
                cb(404, findError);
            }
        });
    },
    updateUserEmail: (data, cb) => {
        const creditCardCollection = mongodbConnection.db().collection("CreditCard");

        // Update User
        creditCardCollection.updateMany(data.primaryKeys, data.updates, (creditCardLevelErr) => {
            if (!creditCardLevelErr) {
                const shippingAddressesCollection = mongodbConnection.db().collection("ShippingAddress");

                shippingAddressesCollection.updateMany(data.primaryKeys, data.updates, (shippingAddressErr) => {
                    if (!shippingAddressErr) {
                        const userCollection = mongodbConnection.db().collection("User");
                        userCollection.updateOne(data.primaryKeys, data.updates, (userLevelErr, result) => {
                            if (!userLevelErr) {
                                cb(200, result);
                            } else {
                                console.log("User Email UPDATE ERROR at EMAIL level: " + userLevelErr);
                                cb(500, userLevelErr);
                            }
                        });
                    } else {
                        console.log("User Email UPDATE ERROR at SHIPPING_ADDRESS level: " + shippingAddressErr);
                        cb(500, shippingAddressErr);
                    }
                });
            } else {
                console.log("User Email UPDATE ERROR at Credit Card level: " + creditCardLevelErr);
                cb(500, creditCardLevelErr);
            }
        });
    },
    updateUser:  (data, cb) => {
        // Access User collection
        const collection = mongodbConnection.db().collection("User");
        // Update User
        collection.updateOne(data.primaryKeys, data.updates, (error, result) => {
            if (!error) {
                cb(200, result);
            } else {
                console.log("UPDATE ERROR: " + error);
                cb(500, error);
            }
        });
    },
    getCreditCardsByUser: (data, cb) => {
        console.log(data);
        // Access CreditCard collection
        const collection = mongodbConnection.db().collection("CreditCard");
        // Find credit cards by user_email(foreign key)
        collection.find({ email: data.email }).toArray( (findError, findResults) => {
            if(findResults){
                cb(200, findResults);
            }
            else{
                cb(404, "CREDIT CARDS NOT FOUND");
            }
        });
    },
    addCreditCard: (data, cb) => {
        // Access CreditCard collection
        const collection = mongodbConnection.db().collection("CreditCard");
        // Insert credit card into CreditCard collection
        collection.insertOne(data, (addError, addResult) => {
            if (!addError) {
                cb(200, addResult);
            } else {
                console.log(addError);
                cb(500, addError);
            }
        });
    },
    removeCreditCard: (data, cb) => {
        // Access CreditCard collection
        const collection = mongodbConnection.db().collection("CreditCard");
        // Delete credit card from CreditCard collection
        collection.deleteOne({email: data.email, credit_card_num: data.credit_card_num}, (deleteError, deleteResult) => {
            if (!deleteError) {
                cb(200, deleteResult);
            } else {
                console.log(deleteError);
                cb(500, deleteError);
            }
        });
    },
    updateCreditCard: (data, cb) => {
        // Access CreditCard collection
        const collection = mongodbConnection.db().collection("CreditCard");
        // Update Credit card
        collection.updateOne(data.primaryKeys, data.updates, (error, result) => {
            if (!error) {
                cb(200, result);
            } else {
                console.log(error);
                cb(500, error);
            }
        });
    },
    getShippingAddressesByUser: (data, cb) => {
        // Access ShippingAddress collection
        const collection = mongodbConnection.db().collection("ShippingAddress");
        // Find shipping address by email
        collection.find({ email: data.email}).toArray( (findError, findResults) => {
            if(findResults){
                // console.log(findResults);
                cb(200, findResults);
            }
            else{
                cb(404, findError);
            }
        });
    },
    addShippingAddress: (data, cb) => {
        // Access ShippingAddress collection
        const collection = mongodbConnection.db().collection("ShippingAddress");
        // Add shipping address to ShippingAddress collection
        collection.insertOne(data, (addError, addResult) => {
            if (!addError) {
                cb(200, addResult);
            } else {
                console.log(addError);
                cb(500, addError);
            }
        });
    },
    removeShippingAddress: (data, cb) => {
        // Access ShippingAddress collection
        const collection = mongodbConnection.db().collection("ShippingAddress");
        // Delete shipping address from the ShippingAddress collection
        collection.deleteOne({_id: new ObjectID(data._id)}, (deleteError, deleteResult) => {
            if (!deleteError) {
                cb(200, deleteResult);
            } else {
                console.log(deleteError);
                cb(500, deleteError);
            }
        });
    },
    updateShippingAddress: (data, cb) => {
        // Access ShippingAddress collection
        const collection = mongodbConnection.db().collection("ShippingAddress");
        // Update the shipping address
        collection.updateOne(data.primaryKeys, data.updates, (updateError, updateResult) => {
            if (!updateError) {
                cb(200, updateResult);
            } else {
                console.log(updateError);
                cb(500, updateError);
            }
        });
    }
};

module.exports = user;
