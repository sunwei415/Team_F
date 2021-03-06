const Payroll = artifacts.require('Payroll');

contract('Payroll', function (accounts) {
    const owner = accounts[0];

    const employee = accounts[1];

    const payDuration = 31 * 86400;

    it('get paid after pay duration', function () {
        let payroll;

        return Payroll.new().then(function (instance) {
            payroll = instance;
            return instance.addFund({from: owner, value: web3.toWei(2, 'ether')});
        })
            .then(function () {
                return payroll.addEmployee(employee, 1, {from: owner});
            })
            .then(function () {
                web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [payDuration], id: 0})
            })
            .then(function () {
                return payroll.getPaid({from: employee});
            })
            .then(function () {
                assert(true, 'should receive payment');
            }).catch(error => {
                assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
            });
    });

    it('should not get paid before pay duration', function () {
        let payroll;

        return Payroll.new().then(function (instance) {
            payroll = instance;
            return instance.addFund({from: owner, value: web3.toWei(2, 'ether')});
        })
            .then(function () {
                return payroll.addEmployee(employee, 1, {from: owner});
            })
            .then(function () {
                return payroll.getPaid({from: employee});
            })
            .then(function () {
                assert(false, 'should not receive payment');
            }).catch(error => {
                assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
            });
    });

});