var express = require('express');
var router = express.Router();

//------------- mongojs -------------------------------------------------------
//var databaseUrl = "guest_book"; // "username:password@example.com/mydb"
//var databaseUrl = 'mongodb://psw7194:dbswjs0221@ds047591.mongolab.com:47591/spark';
var databaseUrl = 'mongodb://psw7194:qkrtkddn@ds047591.mongolab.com:47591/spark';
//var collections = ["GuestBookMsgs"];
var collections = ["notice"];
var ObjectId = require("mongojs").ObjectId;
var db = require("mongojs").connect(databaseUrl, collections);
//-----------------------------------------------------------------------------

var my_utils = require('./my-common-utils'); //date functions

//-----------------------------------------------------------------------------
router.get('/countAll', function(req, res) {
    db.notice.count(function(error,result){
        if(!error) {
            console.log("count :"+result);
            res.json(result);
        }
    });
});

//-----------------------------------------------------------------------------
router.get('/list/:page/:listPerPage', function(req, res) {
    console.log('******** list page , req.params.page :'+ req.params.page  ); //debug
    console.log('******** list page , req.params.listPerPage :'+ req.params.listPerPage  ); //debug

    if(req.params.page==1){
        db.notice.find().sort({_id:-1}).limit( parseInt(req.params.listPerPage)  , function(err, page_msgs) {
            if (err) {
                console.log('******** list page error ************'); //debug
                res.send(err)
            }

            res.json(page_msgs);
        });
    }else{
        db.notice.find().sort({_id:-1}).skip((req.params.page-1)*parseInt(req.params.listPerPage)  ).limit(parseInt(req.params.listPerPage)  , function(err, page_msgs) {
            if (err) {
                console.log('******** list page error ************'); //debug
                res.send(err)
            }

            res.json(page_msgs);
        });
    }

});

//-----------------------------------------------------------------------------
router.get('/view/:msgObjId', function(req, res) {
    console.log('******** view ,req.params.msgObjId:'+req.params.msgObjId); //debug
    //update hits
    db.notice.update( {"_id": ObjectId(req.params.msgObjId)}, {$inc:{hits:1}},
        function(err, one_guest_msg) {
            if (err) {
                console.log('******** update hits ,Error!'+err); //debug
                res.send(err)
            }
        });

    //findOne!!
    db.notice.findOne( {"_id": ObjectId(req.params.msgObjId)}, function(err, one_guest_msg) {
        if (err) {
            console.log('******** view ,Error!'+err); //debug
            res.send(err)
        }
        res.json(one_guest_msg);
    });
});


//-----------------------------------------------------------------------------
router.post('/write', function(req, res) {
    console.log('******** write : '+my_utils.getTimeStamp()); //debug
    db.notice.save({
            user  : req.body.user,
            title : req.body.title,
            contents : req.body.contents,
            reg_date : my_utils.getTimeStamp(),
            hits : 0
        },
        function(err, saved) {
            if( err || !saved) {
                console.log("msg not saved");
            } else {
                res.end(); //필요하다.
            }
        });
});

//-----------------------------------------------------------------------------
router.delete('/:msgObjId', function(req, res) {
    console.log('******** delete ,req.params.msgObjId:'+req.params.msgObjId); //debug
    //findOne!!
    db.notice.remove( {"_id": ObjectId(req.params.msgObjId)}, function(err, data) {
        if (err) {
            console.log('******** remove ,Error!'+err); //debug
            res.send(err)
        }
        res.end(); //필요하다.
    });
});

//-----------------------------------------------------------------------------
router.put('/', function(req, res) {
    console.log('******** update : _id ==>'+req.body._id); //debug

    db.notice.findOne(
        {"_id": ObjectId(req.body._id)},
        function(err, one_guest_msg) {
            if (err) {
                console.log('******** edit ,Error!'+err); //debug
                res.send(err)
            }

            db.notice.update(
                {"_id": ObjectId(req.body._id)},
                {
                    user  : req.body.user,
                    title : req.body.title,
                    contents : req.body.contents,
                    reg_date : one_guest_msg.reg_date, //기존값 그대로 !!
                    hits : one_guest_msg.hits //기존값 그대로 !!
                },
                function(err, data) {
                    if (err) {
                        console.log('******** update msg ,Error!'+err); //debug
                        res.send(err)
                    }
                    res.end(); //필요하다.
                });
        });


});

//-----------------------------------------------------------------------------
module.exports = router;
