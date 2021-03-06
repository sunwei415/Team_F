var Payroll = artifacts.require("Payroll");

contract('Payroll', function (accounts) {

    const owner = accounts[0];

    const employee = accounts[1];

    const guest = accounts[2];

    it('should run', function () {
        let payroll;
        return Payroll.new().then(function (instance) {
            payroll = instance;
            payroll.addEmployee(employee, 1);
        }).then(function () {
            payroll.addFund({from: owner, value: web3.toWei(2, 'ether')});
        }).then(() => {
            return payroll.calculateRunway();
        }).then(runway => {
            assert.equal(runway, 2, "runway should beo 30 / 1");
        }).catch(error => {
            assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
        });;
    });

    it('addEmployee should reject illegal salary', function () {
        let payroll;
        return Payroll.new().then(function (instance) {
            payroll = instance;
            payroll.addEmployee(employee, -1);
        }).then(() => {
            assert(false, "adding employee with illegal salary should fail!");
        }).catch(error => {
            assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
        });
    });

    it("guest should fail to call addEmployee", function () {
        let payroll;
        return Payroll.new().then(function (instance) {
            payroll = instance;
            payroll.addEmployee(employee, 1, {from: guest});
        }).then(() => {
            assert(false, "adding employee with illegal salary should fail!");
        }).catch(error => {
            assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
        });
    });

    it("employee should fail to call addEmployee", function () {
        let payroll;
        return Payroll.new().then(function (instance) {
            payroll = instance;
            payroll.addEmployee(employee, 1, {from: employee});
        }).then(() => {
            assert(false, "adding employee with illegal salary should fail!");
        }).catch(error => {
            assert.include(error.toString(), "Error: VM Exception", "Cannot call removeEmployee() by guest");
        });
    });
});