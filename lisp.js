
//An environment: a dict of {'var':val} pairs, with an outer Env.
function Env(dict)
{
  var env={},outer=dict.outer || {};
  if (dict.parms.length!=0)
   {
    for (var i=0;i<dict.parms.length;i+=1)
    {
     env[dict.parms[i]]=dict.args[i];
    }
   }
  env.find=function(variable)
  {
   if (env.hasOwnProperty(variable))
   {
     return env;
   }
   else
   {
   return outer.find(variable);
   }
  }
return env;
}

//function to add some Scheme standard procedures to an environment
function add_globals(env){
  env['+'] = function(a,b) {return a+b;}
  env['-'] = function (a,b) {return a-b;}
  env['*'] = function (a,b) {return a*b;}
  env['/'] = function (a,b) {return a/b;}
  env['>'] = function (a,b) {return a>b;}
  env['<'] = function (a,b) {return a<b;}
  env['>='] = function (a,b) {return a>=b;}
  env['<='] = function (a,b) {return a<=b;}
  env['=='] = function (a,b) {return a==b;}
  env['remainder']=function(a,b) {return a%b;}
  env['equal?'] = function (a,b) {return a==b;}
  env['eq?'] = function (a,b) {return a==b;}
  env['not'] = function (a) {return !a;}
  env['length'] = function (a) { return a.length; }
  env['cons'] = function (a,b) {return [a].concat(b); }
  env['car'] = function (a) { return (a.length !==0) ? a[0] : null;}
  env['cdr'] = function (a) { return (a.length>1) ? a.slice(1) : null;}
  env['append'] = function (a,b) { return a.concat(b); }
  env['list'] = function () {return Array.prototype.slice.call(arguments);}
  env['list?'] = function (a) { return (a instanceof Array);}
  env['null?'] = function (a) { return (a.length == 0); }
  env['symbol?'] = function (a) { return (typeof a == 'string') ;}
  return env;
}
var global_env=add_globals(Env({parms:[],args:[],outer:undefined}));

//function to evaluate an expression in an environment

function eval(x,env)
{
  env=env || global_env;
  if (typeof x==='string')
  {
    return env.find(x.valueOf())[x.valueOf()];
  }
  else if (typeof x==='number')
  {
    return x;
  }
  else if (x[0]==='quote')
  {
    return x[1];
  }
  else if (x[0]=='if')
  {
    var test=x[1],conseq=x[2],alt=x[3];
    if (eval(test,env))
     {
        return eval(conseq,env);
     }
    else{
        return eval(alt,env);}
     }
  else if(x[0]==='set!')
  {
    env.find(x[1])[x[1]]=eval(x[2],env);
  }
  else if (x[0]==='define')
  {
     env[x[1]]=eval(x[2],env);
  }
  else if (x[0]==='lambda')
  {
   var vars=x[1],exp=x[2];
   return function()
   {
    return eval(exp,Env({parms:vars,args:arguments,outer:env}));
   }; 
  }
  else if (x[0]==='begin')
  {
   var val;
   for (var i=1;i<x.length;i+=1)
   val=eval(x[i],env);
   return val;
   }
  else
   {
   var exps=[];
   for (i=0;i<x.length;i+=1)
     exps[i]=eval(x[i],env);
   var proc=exps.shift();
   return proc.apply(env,exps);
  }
}

//function to parse the given string
function read(string)
{
return read_from(tokenize(string))
}

//function to string into list of tokens
function tokenize(s){
    return s.replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().split(/\s+/);
}

//function to read tokens in way to convert them to list of lists
function read_from(tokens)
{
  if (tokens.length==0){console.log("SyntaxError:unexpected EOF while reading");}
  var token=tokens.shift();
  if ('('===token)
   {
     var L=[]; 
     while(')'!==tokens[0])
      {
      L.push(read_from(tokens));
      }
  tokens.shift();
  return L;
  }
  else{
  if (')'===token){
    console.log("SyntaxError:unexpected )");
   }
  else {
    return atom(token);}
  }
  }
function atom(token)
{
  if (isNaN(token))
   {
    return token;
   }
  else{
    return parseFloat(token);
   }
  }


//function repl (read-eval-print loop) 
function repl() {
  var stdin = process.stdin, stdout = process.stdout;
  stdin.resume();
  stdout.write("lisp.js>>> ");
  stdin.on('data',function(data){
  data = (data + "").trim();
  var result = eval(read(data));
  if (result != undefined)
    stdout.write(result+'\nlisp.js>>> ');
  else
    stdout.write('lisp.js>>> ');});
}
repl()
