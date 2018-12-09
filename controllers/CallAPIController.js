var Request = require("request");
var ItemProduct = require('../models/ItemProduct');

module.exports = {
    // ======= GET =========
    checkRestrictions: function (req, res) {


        ItemProduct.findById(req.params.id)
            .populate('childrenProducts')
            .exec(function (err, itemProduct) {
                if (err)
                    res.send(err);


                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "https://iteracao1.azurewebsites.net/api/Product/CheckProduct",
                    "body": JSON.stringify(itemProduct)
                }
                    , (err, response, body) => {
                        console.log(JSON.stringify(body));
                        
                        data = JSON.parse(body);
                        

                        data.forEach(element => {
                            var item = new ItemProduct();

                            item.productId = element.productId;
                            item.name = element.name;
                            item.price = element.price;
                            //item.childrenProducts = element.childrenProducts;
                            item.width = element.width;
                            item.height = element.height;
                            item.depth = element.depth;
                            
                            item.save();

                            itemProduct.childrenProducts = itemProduct.childrenProducts.concat([item._id]);
                            itemProduct.save();
                        });


                        if (err) {
                            res.send(err);
                        }
                        //response.end();
                        res.end();

                });

            });
    }
}

/* Request.get("http://localhost:44375/api/Category", (error, response, body) => {
    if(err)
        res.send(err);

    console.dir(JSON.parse(body));
}); */