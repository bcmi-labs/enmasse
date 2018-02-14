/*
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var assert = require('assert');
var myutils = require('../lib/utils.js');

describe('replace', function() {
    it('updates matching string', function(done) {
        var list = ['a', 'b', 'c'];
        assert.equal(myutils.replace(list, 'x', function (o) { return o === 'b'}), true);
        assert.deepEqual(list, ['a', 'x', 'c']);
        done();
    });
    it('returns false when there is no match', function(done) {
        var list = ['a', 'b', 'c'];
        assert.equal(myutils.replace(list, 'x', function (o) { return o === 'foo'}), false);
        assert.deepEqual(list, ['a', 'b', 'c']);
        done();
    });
});

describe('merge', function() {
    it('combines fields for multiple objects', function(done) {
        var obj = myutils.merge({'foo':10}, {'bar':9});
        assert.deepEqual(obj, {'foo':10, 'bar':9});
        done();
    });
});

describe('serialize', function () {
    var in_use = false;
    var calls = 0;
    function one_at_a_time() {
        assert.equal(in_use, false, 'function already in use');
        in_use = true;
        calls++;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                in_use = false;
                resolve();
            }, 10);
        });
    }

    it ('ensures a new invocation is not made until the previous one has finished', function (done) {
        calls = 0;
        var f = myutils.serialize(one_at_a_time);
        for (var i = 0; i < 10; i++) {
            f();
        }
        setTimeout(function () {
            assert.equal(calls, 10);
            done();
        }, 500);
    });
    it ('handles invocations at different times', function (done) {
        calls = 0;
        var f = myutils.serialize(one_at_a_time);
        setTimeout(f, 5);
        setTimeout(f, 15);
        setTimeout(f, 16);
        setTimeout(f, 20);
        setTimeout(f, 28);

        setTimeout(function () {
            assert.equal(calls, 5);
            done();
        }, 100);
    });
});
