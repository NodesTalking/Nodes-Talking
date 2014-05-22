/**
                     _____                        _____         _
 /$$      /$$                                                                   /$$$$$$                                                          /$$$$$$$$                    /$$
| $$$    /$$$                                                                  /$$__  $$                                                        |__  $$__/                   | $$
| $$$$  /$$$$  /$$$$$$   /$$$$$$$ /$$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$       | $$  \__/  /$$$$$$   /$$$$$$  /$$    /$$ /$$$$$$   /$$$$$$          | $$  /$$$$$$   /$$$$$$$ /$$$$$$
| $$ $$/$$ $$ /$$__  $$ /$$_____//$$_____/ |____  $$ /$$__  $$ /$$__  $$      |  $$$$$$  /$$__  $$ /$$__  $$|  $$  /$$//$$__  $$ /$$__  $$         | $$ /$$__  $$ /$$_____/|_  $$_/
| $$  $$$| $$| $$$$$$$$|  $$$$$$|  $$$$$$   /$$$$$$$| $$  \ $$| $$$$$$$$       \____  $$| $$$$$$$$| $$  \__/ \  $$/$$/| $$$$$$$$| $$  \__/         | $$| $$$$$$$$|  $$$$$$   | $$
| $$\  $ | $$| $$_____/ \____  $$\____  $$ /$$__  $$| $$  | $$| $$_____/       /$$  \ $$| $$_____/| $$        \  $$$/ | $$_____/| $$               | $$| $$_____/ \____  $$  | $$ /$$
| $$ \/  | $$|  $$$$$$$ /$$$$$$$//$$$$$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$$      |  $$$$$$/|  $$$$$$$| $$         \  $/  |  $$$$$$$| $$               | $$|  $$$$$$$ /$$$$$$$/  |  $$$$/
|__/     |__/ \_______/|_______/|_______/  \_______/ \____  $$ \_______/       \______/  \_______/|__/          \_/    \_______/|__/               |__/ \_______/|_______/    \___/
                                                     /$$  \ $$
                                                    |  $$$$$$/
                                                     \______/                                                                                                                        **/

    var MsgServer   = require('../../msgServer/msgserver')
    ,Db             = require('../../db/db')
    ,fs             = require('fs')
    ,Registration = require('../../models/registration')

var boot    = fs.readFileSync('./json/bootstrap.json','utf8')
var config  = JSON.parse(boot)

describe("send and receive messages from a RabbitMQ message node", function() {
//start up msg server and sit on an exchange and routing key
    var msgServer   = undefined

    var mongoose    = new Db('mongoose')
    console.log("collection = " + config.model)
    mongoose.connect(config.model.toLowerCase())

    it("should assert not undefined for connection to msg server", function() {
        msgServer = new MsgServer('amqpnode')
        msgServer.connect('amqp://localhost')

        function regMsg (msg) {
            console.log(" [x]: Routing Key: '%s' -- Received Msg: '%s'", msg.fields.routingKey, msg.content)
            mongoose.save(config.model,JSON.parse(msg.content))
        }
        msgServer.receiveMessage("tests"/*the exchange*/,'register-queue',["ack.rk.register"],regMsg)
        expect(msgServer).not.toBe(undefined)
    })

    it("should send a message and get an acknowledgement",function() {
        setTimeout(sendMsg,1500)
        //sit on the ack q
        function sendMsg() {
            var id = Math.floor(Math.random()*1000001)
            var reg = new Registration({'data.message.node.nodeId':'server@'+id})
            console.log("msgServerTest: reg = " + reg)
            //send a message to the well-known reg-queue
            msgServer.sendMessage(reg,'tests'/*the exchange*/,'ack.rk.register')
            setTimeout(sendMsg,1500)
        }
    })
})

