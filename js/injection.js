/*
Javascript Injection  Utils
inspired by Arun Killu
*/
window.injectByFunctionName = function(code, functionName, commandToAdd) {
    code = replaceScapeChars(code);

    //Abstract Syntax Tree
    var ast = pegParser(code); 

    for(var i = 0; i < ast.body.length; i++){
        var obj = ast.body[i];
        if(obj.type === "FunctionDeclaration" && obj.id.name === functionName){
            pegParser(commandToAdd).body.forEach(command => {
                obj.body.body.push(command)
            });
        }
    }

    return pegReverser(ast);
}

// This function handles arrays and objects
window.recursiveFind = function(obj, parent, grandparent, commandName) {
    for (var k in obj)
    {
        if (k === "name" && obj[k] === commandName) {
            return grandparent;
        } else if (typeof obj[k] == "object" && obj[k] !== null) {
            var result = recursiveFind(obj[k], obj, parent, commandName)
            if(result != false)
                return result;
        }
    }
    
    return false;
}

window.updateCommand = function(code, commandName, commandToReplace) {
    code = replaceScapeChars(code);
    
    //Abstract Syntax Tree
    var ast = pegParser(code);

    var obj = recursiveFind(ast, ast, ast, commandName);
    
    var parsed = pegParser(commandToReplace);
    obj.expression.callee = parsed.body[0].expression.callee;
    obj.expression.arguments = parsed.body[0].expression.arguments;
    
    return pegReverser(ast);
}

window.commandExists = function(code, commandName) {
    code = replaceScapeChars(code);
    
    //Abstract Syntax Tree
    var ast = pegParser(code);

    var obj = recursiveFind(ast, ast, ast, commandName);
    
    return obj !== false;
}

window.functionExists = function(code, functionName) {
    code = replaceScapeChars(code);
    
    //Abstract Syntax Tree
    var ast = pegParser(code);

    for(var i = 0; i < ast.body.length; i++){
        var obj = ast.body[i];
        if(obj.type === "FunctionDeclaration" && obj.id.name === functionName){
            return true;
        }
    }
    return false;
}

window.replaceScapeChars = function(text) {
    text = text.replace(/\\n/g, "\\\\n");
    text = text.replace(/\\r/g, "\\\\r");
    text = text.replace(/\\t/g, "\\\\t");
    return text;
}