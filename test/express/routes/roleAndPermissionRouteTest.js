var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');

var roleAndPermissionRouter = require('../../../lib/express/routes/roleAndPermission.js');
var errCodeTable = require('../../../lib/util/errCode.js');

describe('roleAndPermission route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.parallel([
            function (callback) {
                app = express();
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({extended: false}));
                app.use('/', roleAndPermissionRouter);
                server = app.listen(3001, callback);
            },
            function (callback) {
                var bearcatContextPath = require.resolve("../../../ctestbcontext.json");
                bearcat.createApp([bearcatContextPath]);
                bearcat.start(function () {
                    app.set('bearcat', bearcat);
                    callback(null, null);
                });
            }
        ], function (err, results) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
    describe('#post:/permissions\n' +
        'input:{permissionID:"",permissionName:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for register a permission', function () {
            it('should response message with errcode:FAIL if post body is illegal', function (done) {
                var body = {};
                request(server)
                    .post(`/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and permissionID if success', function (done) {
                var body = {
                    permissionID: "permissionID",
                    permissionName: "permissionName"
                };
                request(server)
                    .post(`/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.permissionID.should.be.eql("permissionID");
                        done();
                    });
            });
        });
    });
    describe('#get:/permissions\n' +
        'output:{errcode:0,errmsg:"",permissionID:""}', function () {
        context('request for obtain permissions', function () {
            it('should response message with errcode:OK and permissionDatas if success', function (done) {
                request(server)
                    .get(`/permissions`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.permissionDatas.length.should.be.eql(1);
                        done();
                    });
            });
        });
    });
    describe('#post:/roles/${roleID}/permissions\n' +
        'input:{permissionIDs:[]}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for assign permission to role', function () {
            it('should response message with errcode:FAIL if no a such role', function (done) {
                var roleID = "noRoleID";
                var body = {
                    permissionIDs: ["permissionID"]
                }
                request(server)
                    .post(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:FAIL if no a such permission', function (done) {
                var roleID = "roleID";
                var body = {
                    permissionIDs: null
                }
                request(server)
                    .post(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and permissionDatas if success', function (done) {
                var roleID = "roleID";
                var body = {
                    permissionIDs: ["permissionID"]
                }
                request(server)
                    .post(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#delete:roles/${roleID}/permissions\n' +
        'input:{permissionIDs:[]}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for delete a permission', function () {
            it('should response message with errcode:FAIL if no a such role', function (done) {
                var roleID = "noRoleID";
                var body = {
                    permissionIDs: ["permissionID"]
                }
                request(server)
                    .del(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:FAIL if no a such permission', function (done) {
                var roleID = "roleID";
                var body = {
                    permissionIDs: null
                }
                request(server)
                    .del(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and permissionDatas if success', function (done) {
                var roleID = "roleID";
                var body = {
                    permissionIDs: ["permissionID"]
                }
                request(server)
                    .del(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#get:/roles\n' +
        'output:{errcode:0,errmsg:"",roleDatas:[]}', function () {
        context('request for obtain roles', function () {
            it('should response message with errcode:OK and roleDatas if success', function (done) {
                request(server)
                    .get(`/roles`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.roleDatas.length.should.be.eql(1);
                        done();
                    });
            });
        });
    });
    describe('#delete:/permissions/:permissionID\n' +
        'input:{permissionID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for delete a permission', function () {
            it('should response message with errcode:FAIL if no a such permission', function (done) {
                var permissionID = "noPermissionID";
                request(server)
                    .del(`/permissions/${permissionID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and isSuccess:true if success', function (done) {
                var permissionID = "permissionID";
                request(server)
                    .del(`/permissions/${permissionID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });

    after(function (done) {
        async.parallel([
            function (callback) {
                server.close(callback);
            }], function (err, results) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
});