"use strict";
// Requiring dependencies
var fs = require("fs");

// Beginning of code
exports.file = "";
exports.currency = "";

exports.recent = function(){
    /*
     * Reads a file (fullpath) containing ledgerCLI records and parse it into a JSON
     * friendly format by creating a transaction object in the
     * following format:
     *
     * {date, consolidated, payee, postings{account, amount, currency}}
     */
    // Reads the ledger file and break it into lines
    var ledgerFile   = fs.readFileSync(exports.file, "utf8"),
        // Matches the transaction's first line
        RegDate      = /^(2[0-9]+\/[0-9]{2}\/[0-9]{2})(?:[ ]*)([\*\! ]{1})(?:[ ]*)([ a-z0-9\(\)\']+)/i,
        // Matches account and amount
        RegPost      = new RegExp("^(?:[ ]{2,})([\\:a-z\\-]*)(?:[ ]{2,}|)(" + exports.currency + "?)([\\.\\-0-9]*)", "i"),
        // Creates an array with the sourced file breaking it by lines
        tArray       = ledgerFile.split("\n"),
        // Creates the base variables
        transaction  = {},
        transactions = [];
    // Loops through each line of the file to structure the object
    tArray.forEach(function(e) {
        if(e.match(RegDate)) {
            // If coming from a previous transaction
            if (transaction.payee) {
                transactions.push(transaction);
            }
            transaction = {};
            //Starts the parsing
            var matched              = e.match(RegDate);
            transaction.date         = matched[1];
            transaction.consolidated = matched[2];
            transaction.payee        = matched[3];
            transaction.postings     = [];
        }
        else if (e.match(RegPost)) {
            var matched      = e.match(RegPost),
                posting      = {};
            posting.account  = matched[1].split(":");
            posting.currency = matched[2];
            posting.amount   = matched[3];
            transaction.postings.push(posting);
        }
    });

    if (transaction.payee) {
        transactions.push(transaction);
        transaction = {};
    }

    return transactions;
};

exports.add = function (transaction) {
    if (
        !transaction.date ||
            !transaction.payee ||
            !transaction.postings[0].account
    ) {
        return [400, "Can't add transaction, format not compatible"];
    }

    var tPostings   = [],
        tString     = "\n";

    tString += transaction.date + " ";
    tString += transaction.consolidated + " ";
    tString += transaction.payee + " \n";

    transaction.postings.forEach( function(e){
        var posting = "    ";
        posting += e.account + "  ";
        posting += e.currency;
        posting += e.amount;
        tPostings.push(posting);
    });

    tString += tPostings.join("\n");

    fs.appendFileSync(exports.file, tString);

    return [200, "Success!"];
};
