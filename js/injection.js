/*
 * Javascript Injection  Utils using Peg.js JS parser
 * Code by Vamoss
*/
window.Injection = function() {
    //PRIVATE METHODS
    function recursiveFind(obj, parent, grandparent, commandName) {
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

    function replaceScapeChars(text) {
        text = text.replace(/\\n/g, "\\\\n");
        text = text.replace(/\\r/g, "\\\\r");
        text = text.replace(/\\t/g, "\\\\t");
        return text;
    }

    //PUBLIC METHODS
    this.injectByFunctionName = function(code, functionName, commandToAdd) {
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

    this.addAfterVariableName = function(code, variableName, commandToAdd) {
        code = replaceScapeChars(code);

        //Abstract Syntax Tree
        var ast = pegParser(code);

        for(var i = 0; i < ast.body.length; i++){
            var obj = ast.body[i];
            if(obj.type === "VariableDeclaration" && obj.declarations[0].id.name === variableName){
                pegParser(commandToAdd).body.forEach((command, index) => {
                    ast.body.splice(i+index+1, 0, command);
                });
                break;
            }
        }

        return pegReverser(ast);
    }
    
    this.updateCommand = function(code, commandName, commandToReplace) {
        code = replaceScapeChars(code);
        
        //Abstract Syntax Tree
        var ast = pegParser(code);

        var obj = recursiveFind(ast, ast, ast, commandName);
        
        var parsed = pegParser(commandToReplace);
        obj.expression.callee = parsed.body[0].expression.callee;
        obj.expression.arguments = parsed.body[0].expression.arguments;
        
        return pegReverser(ast);
    }

    //Works with function name or variable name
    this.commandExists = function(code, commandName) {
        code = replaceScapeChars(code);
        
        //Abstract Syntax Tree
        var ast = pegParser(code);

        var obj = recursiveFind(ast, ast, ast, commandName);
        
        return obj !== false;
    }

    this.functionExists = function(code, functionName) {
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

    this.validate = function(code) {
        return pegReverser(
            pegParser(
                replaceScapeChars(code)
            )
        );
    }

    return this;
}