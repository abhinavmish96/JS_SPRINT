/* Chap 14 Asynchronous Programming*/

//All the code snippets to be run in browser console for best results

/* Callbacks */

// setTimeout function as callback
console.log('Before timeout: ' + new Date());
function f(){
    console.log('After timeout: ' + new Date());
}
setTimeout(f, 60*1000); // one minute
console.log('I happen after setTimeout!');
console.log('Me too!');

/* setInterval and clearInterval */
const start = new Date();
let i = 0;
const intervalId = setInterval(function(){
    let now = new Date();
    if(now.getMinutes() != start.getMinutes() || ++i>10) return clearInterval(intervalId);
    console.log(`${i} : ${now}`);
}, 5*1000);

/* Scope and Asynchronous function */
// 5-second countdown result : -1 six
function countdown(){
    let i;
    console.log('Countdown:');
    for(i = 5; i >= 0; i-- ){
        setTimeout(function(){
            console.log(i==0 ? 'Go!' : i);
        }, (5-i)*1000);
    }
}
countdown();

// 5-second countdown correct result
function countdown(){
    console.log('Countdown:');
    for(let i = 5; i >= 0; i-- ){
        setTimeout(function(){
            console.log(i==0 ? 'Go!' : i);
        }, (5-i)*1000);
    }
}
countdown();

/* Error-first Callbacks */
// reading the contents of a file in Node
const fs = require('fs');

const fname = 'may_or_may_not_exist.txt';
fs.readFile(fname, function(err, data){
    if(err) return console.log(`error reading file ${fname}: ${err.message}`);
    console.log(`${fname} contents: ${data}`)
});

/* callback hell */
// callback hell triangle
const fs = require('fs');

fs.readFile('a.txt', function(err, dataA){
    if(err) console.log(err);
    fs.readFile('b.txt', function(err, dataB){
        if(err) console.log(err);
        fs.readFile('c.txt', function(err, dataC){
            if(err) console.log(err);
            setTimeout(function(){
                fs.writeFile('d.txt',dataA+dataB+dataC, function(err){
                    if(err) console.log(err);
                });
            }, 60*1000);
        });
    });
});

//try..catch failure
const fs = require('fs');
function readSketchyFile(){
    try{
        fs.readFile('does_not_exist.txt', function(err, data){
            if(err) throw err;
        }); 
    } catch(err){
        console.log('warning: minor issue occured, program counting');
    }
}
reaSketchyFile();

/* creating promises */
function countdown(seconds){
    return new Promise(function (resolve, reject){
        for(let i = seconds; i>=0; i--) {
            setTimeout(function(){
                if(i>0) console.log(i+'...');
                else resolve(console.log('Go!'));
            }, (seconds - i)*1000);
        }
    });
}
// use of then handler
countdown(5).then(
    function(){
        console.log("countdowm completed successfully");
    },
    function(err){
        console.log("countdowm experinced an error:" + err.message);
    }
);
// use of catch with promise stored in the variable
const p = countdown(5);
p.then(function(){
    console.log("countdowm completed successfully")
});
p.catch(function(err){
    console.log("countdowm experinced an error:" + err.message);
});

// modified promises
function countdown(seconds){
    return new Promise(function (resolve, reject){
        for(let i = seconds; i>=0; i--) {
            setTimeout(function(){
                if(i===13) return reject(new Error('DEFINITELY NOT COUNTING THAT'));
                if(i>0) console.log(i+'...');
                else resolve(console.log('Go!'));
            }, (seconds - i)*1000);
        }
    });
}
const p = countdown(5);
p.then(function(){
    console.log("countdowm completed successfully")
});
p.catch(function(err){
    console.log("countdowm experinced an error:" + err.message);
});

/* Events */
const EventEmitter = require('events').EventEmitter;

class Countdown extends EventEmitter {
    constructor(seconds, superstitious) {
        super();
        this.seconds = seconds;
        this.superstitious = superstitious;
    }
    go(){
        const countdown = this;
        return new Promise(function (resolve, reject){
            for(let i = countdown.seconds; i>=0; i--) {
                setTimeout(function(){
                    if(countdown.supertitious && i===13) return reject(new Error('DEFINITELY NOT COUNTING THAT'));
                    countdown.emit('tick', i);
                    if(i===0) resolve();
                }, (countdown.seconds - i)*1000);
            }
        });
    }
}
const c = new Countdown(5);
c.on('tick', function(i){
    if(i>0) console.log(i+'...');
});

c.go()
    .then(function(){
        console.log('GO!');
    })
    .catch(function(err){
        console.error(err.message);
    })
//


/* Promise chaining */

const EventEmitter = require('events').EventEmitter;

class Countdown extends EventEmitter {
    constructor(seconds, superstitious) {
        super();
        this.seconds = seconds;
        this.superstitious = superstitious;
    }
    go(){
        const countdown = this;
        return new Promise(function (resolve, reject){
            for(let i = countdown.seconds; i>=0; i--) {
                setTimeout(function(){
                    if(countdown.supertitious && i===13) return reject(new Error('DEFINITELY NOT COUNTING THAT'));
                    countdown.emit('tick', i);
                    if(i===0) resolve();
                }, (countdown.seconds - i)*1000);
            }
        });
    }
}

function launch(){
    return new Promise(function(resolve, reject){
        console.log('Lift off!');
        setTimeout(function(){
            resole('In orbit!');
        }, 2*1000);
    });
}

const c = new Countdown(5)
    .on('tick', i => console.log(i+'...'));

c.go()
    .then(launch)
    .then(function(msg){
        console.log(msg);
    })
    .catch(function(err){
        console.error(err.message);
    })
//

/* Generators */
// error-first
function nfcall(f,...args){
    return new Promise(function(resolve, reject){
        f.call(null,...args,function(err,...args){
            if(err) return reject(err);
            resolve(args.length<2 ? args[0]:args);
        });
    });
}
//setTimeout
function ptimeout(delay){
    return new Promise(function(resolve, reject){
        setTimeout(resolve, delay);
    });
}
//generator runner
function grun(g){
    const it = g();
    (function iterate(val){
        const x = it.next(val);
        if(!x.done){
            if(x.value instanceof Promise){
                x.value.then(iterate).catch(err => it.throw(err));
            } else {
                settimeout(iterate, 0, x.value);
            }
        }
    })();
}
//generator
function* theFutureIsNow(){
    const dataA = yield nfcall(fs.readFile, 'a.txt');
    const dataB = yield nfcall(fs.readFile, 'b.txt');
    const dataC = yield nfcall(fs.readFile, 'c.txt');
    yield ptimeout(60*1000);
    yield nfcall(fs.writeFile, 'd.txt', dataA+dataB+dataC);
}
grun(theFutureIsNow);

//Promise.all
function* theFutureIsNow(){
    const data = yield Promise.all([nfcall(fs.readFile, 'a.txt'), nfcall(fs.readFile, 'b.txt'), nfcall(fs.readFile, 'c.txt')]);
    yield ptimeout(60*1000);
    yield nfcall(fs.writeFile, 'd.txt', data[0]+data[1]+data[2]);
}