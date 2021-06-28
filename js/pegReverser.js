/*
 * Code by Tiago Rezende
 * https://codesandbox.io/s/sleepy-cori-r8vh4?file=/src/index.js
 */
window.pegReverser = function() {
    const pegReverseDict = {
        Program: (node) => `${node.body.map((inner) => pegReverse(inner)).join("\n\n")}`,
        ArrowFunctionDeclaration: (node) =>	
            `(${node.params.map((inner) => pegReverse(inner)).join(", ")}) => ${pegReverse(	
            node.body	
            )}`,
        AssignmentExpression: (node) =>
            `${pegReverse(node.left)} ${node.operator} ${pegReverse(node.right)}`,
        BinaryExpression: (node) =>
            `${pegReverse(node.left)} ${node.operator} ${pegReverse(node.right)}`,
        BlockStatement: (node) =>
            `{${node.body.map((expr) => `\n${pegReverse(expr)}`).join("")}\n}`,
        CallExpression: (node) =>
            `${pegReverse(node.callee)}(${node.arguments
            .map((arg) => pegReverse(arg))
            .join(", ")})`,
        DecimalLiteral: (node) => node.value,
        DoubleQuotedStringLiteral: (node) => `"${node.value}"`,
        ExpressionStatement: (node) => `${pegReverse(node.expression)};`,
        FunctionDeclaration: (node) =>
            `function ${pegReverse(node.id)}(${node.params
            .map((inner) => pegReverse(inner))
            .join(", ")}) ${pegReverse(node.body)}`,
        FunctionExpression: (node) =>
            `function(${node.params.map((param) => pegReverse(param)).join(", ")}) ${pegReverse(
            node.body
            )}`,
        Identifier: (node) => node.name,
        Literal: (node) => node.value,
        MemberExpression: (node) =>
            node.computed
            ? `${pegReverse(node.object)}[${pegReverse(node.property)}]`
            : `${pegReverse(node.object)}.${pegReverse(node.property)}`,
        NewExpression: (node) =>
            `new ${pegReverse(node.callee)}(${node.arguments
            .map((arg) => pegReverse(arg))
            .join(", ")})`,
        SingleQuotedStringLiteral: (node) => `'${node.value}'`,
        VariableDeclaration: (node) =>
            `${node.kind} ${node.declarations.map((decl) => pegReverse(decl)).join(", ")}`,
        VariableDeclarator: (node) =>
            node.init == null
            ? `${pegReverse(node.id)};`
            : `${pegReverse(node.id)} = ${pegReverse(node.init)};`,
        IfStatement: (node) =>
            `if(${pegReverse(node.test)}) ${pegReverse(node.consequent)}`
            + (node.alternate ? `else ${pegReverse(node.alternate)}` : ""),
        ReturnStatement: (node) =>
            `return ${pegReverse(node.argument)}`,
        ForStatement: (node) =>
            `for(${pegReverse(node.init)} ${pegReverse(node.test)}; ${pegReverse(node.update)}) ${pegReverse(node.body)}`,
        UpdateExpression : (node) => 
            node.prefix ? `${node.operator}${pegReverse(node.argument)}` : `${pegReverse(node.argument)}${node.operator}`,
        ArrayExpression : (node) =>
            `[${node.elements.map((inner) => pegReverse(inner)).join(", ")}]`,
        EmptyStatement: (node) => " "
    };

    function pegReverse(node) {
        if (node.type in pegReverseDict) {
            return pegReverseDict[node.type](node);
        } else return `[${node.type}]`;
    };

    return pegReverse;
}()