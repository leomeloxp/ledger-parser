// Requiring dependencies
var fs = require('fs');

// Beginning of code
exports.recent = function(file){
    /*
     * Reads a file (fullpath) containing ledgerCLI records and parse it into a JSON
     * friendly format by creating a transaction object in the
     * following format:
     *
     * {date, consolidated, payee, postings{account, amount, currency}}
     */
    // Reads the ledger file and break it into lines
    var ledgerFile   = fs.readFileSync(file, 'utf8'),
        tArray       = ledgerFile.split('\n'),
        // Matches the transaction's first line
        RegDate      = /^(2[0-9]+\/[0-9]{2}\/[0-9]{2})(?:[ ]*)([\*\! ]{1})(?:[ ]*)([ a-z0-9\(\)\']+)/i,
        // Matches account and amount
        RegPost      = /^(?:[ ]{2,})([\:a-z\-]*)[ ]*(£)([\.\-0-9]*)/i,
        // Creates the base variables
        transactions = [],
        transaction  = {};
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
            posting.account  = matched[1];
            posting.currency = matched[2];
            posting.amount   = matched[3];
            transaction.postings.push(posting);
        }
    });

    if (transaction.payee) {
        transactions.push(transaction);
    }

    return transactions;
};
