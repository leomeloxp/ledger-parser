# ledger-parser
A NodeJS file parser for [ledger-cli](http://ledger-cli.org/) formatted files.

Github Repository available [here](https://github.com/leomeloxp/ledger-parser).
## Limitations

* Currently only supports listing transactions in JSON format and adding new transaction from JSON.

* Only supports one currency.

## Usage

### Install package

    npm install ledger-parser

### Require module and supply ledger file to be processed

    var ledger = require('ledger-parser');
    ledger.file = "path/to/file.ldgr";
    ledger.currency = "£";

### List recent transactions

Call `ledger.recent()`. It returns a JS Object literal for easy parsing or sending to front-end.
For example, to send it as a response using [express](http://expressjs.com/) you could do something like (assuming express has been required and set):

    app.get('/recent', function (req, res) { res.status(200).send(ledger.recent()) });
    //returns
    {
        date: "2015/01/05",
        consolidated: "*",
        payee: "Dinner Takeaway",
        postings: [
            {
            account: [
                "expenses",
                "food",
                "takeaway"
            ],
            currency: "£",
            amount: "41.40"
            },
            {
            account: [
                "assets",
                "bank",
                "checking"
            ],
            currency: "",
            amount: ""
            }
        ]
    },

### Adding transactions to your ledger file

Call `ledger.add(transaction)` it takes in a JSON/JS Object Literal like the one above and transforms it into a multi lined string that follows Ledger's syntax. Using the example above as our transaction we'd get:

    ledger.add(transaction);
    // Appends this to your file
    2015/01/05 * Dinner Takeaway
        expenses:food:takeaway  £41.40
        assets:bank:checking