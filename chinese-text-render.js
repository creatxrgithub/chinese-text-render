'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultVerticalWritingStyle = exports.toVerticalWriting = exports.ReplacePunctuation = void 0;
var ReplacePunctuation;
(function (ReplacePunctuation) {
    ReplacePunctuation["keep"] = "keep";
    ReplacePunctuation["space"] = "space";
    ReplacePunctuation["newcol"] = "newcol";
    ReplacePunctuation["none"] = "none";
})(ReplacePunctuation || (exports.ReplacePunctuation = ReplacePunctuation = {}));
var defaultVerticalWritingStyle = {
    SPACE: '　',
    spliterNewLine: '\n\|',
    punctuations: '。﹐﹑﹔﹕﹖﹗' + '，、；：？！' + ' \|\t' + '\'\"\`‘’“”「」『』《》〈〉«»‹›',
    maxCharsPerCol: 8,
    maxColsPerPage: 10,
    cornerTopLeft: '╔',
    cornertopRight: '╗',
    cornerBottomLeft: '╚',
    cornerBottomRight: '╝',
    spliterVerticalTop: '╤',
    spliterVertical: '╎',
    spliterVerticalBottom: '╧',
    borderVertical: '║',
    borderHorizontal: '═',
    //replacePunctuation: 'space'
    replacePunctuation: ReplacePunctuation.none,
    newLineReplacement: '\n'
};
exports.defaultVerticalWritingStyle = defaultVerticalWritingStyle;
function padNewLine(inputStr, fixedLength, spliterNewLinePattern, replacement) {
    if (spliterNewLinePattern === void 0) { spliterNewLinePattern = "[".concat(defaultVerticalWritingStyle.spliterNewLine, "]+"); }
    if (replacement === void 0) { replacement = '　'; }
    if (inputStr === null)
        return '';
    if (inputStr === '')
        return '';
    var strArray = inputStr.split(new RegExp(spliterNewLinePattern, 'g'));
    for (var i = 0; i < strArray.length; i++) {
        var fixedLengthPieces = strArray[i].match(new RegExp(".{1,".concat(fixedLength, "}"), 'g'));
        if (fixedLengthPieces === null) {
            strArray[i] = strArray[i].padEnd(fixedLength, replacement);
        }
        else {
            fixedLengthPieces[fixedLengthPieces.length - 1] = fixedLengthPieces[fixedLengthPieces.length - 1].padEnd(fixedLength, replacement);
            strArray[i] = fixedLengthPieces.join('');
        }
    }
    return strArray.join('');
}
function toVerticalWriting(inputStr, customStyle) {
    var _a;
    if (customStyle === void 0) { customStyle = {}; }
    var style = Object.assign({}, defaultVerticalWritingStyle, customStyle);
    var retStr = '';
    retStr += style.newLineReplacement;
    var str = '';
    var charsPerPage = style.maxCharsPerCol * style.maxColsPerPage;
    switch (style.replacePunctuation.toLowerCase()) {
        case 'keep':
            {
                //use block {...} to keep var locally in "switch...case..." if needed
            }
            str = padNewLine(inputStr, style.maxCharsPerCol, "[".concat(style.spliterNewLine, "]+"));
            break;
        case 'space':
            str = inputStr.replace(new RegExp("[".concat(style.spliterNewLine.toString(), "]+"), 'g'), '\n'); //換行預處理，比如默認將豎綫也作爲換行符
            str = str.replace(new RegExp("[".concat(style.punctuations.toString(), "]+"), 'g'), style.SPACE); //標點替換
            str = padNewLine(str, style.maxCharsPerCol, "[".concat(style.spliterNewLine, "]+")); //塡充列的空白
            str = str.replace(new RegExp("\n+", 'g'), style.newLineReplacement); //換行最終使用字符 <br />
            break;
        case 'none':
            str = inputStr.replace(new RegExp("[".concat(style.spliterNewLine.toString(), "]+"), 'g'), '\n');
            str = str.replace(new RegExp("[".concat(style.punctuations.toString(), "]+"), 'g'), '');
            str = padNewLine(str, style.maxCharsPerCol, "[".concat(style.spliterNewLine, "]+"));
            str = str.replace(new RegExp("\n+", 'g'), style.newLineReplacement); //換行最終使用字符 <br />
            break;
        case 'newcol':
            str = inputStr.replace(new RegExp("[".concat(style.spliterNewLine.toString(), "]+"), 'g'), '\n');
            str = str.replace(new RegExp("[".concat(style.punctuations.toString(), "]+"), 'g'), '\n');
            str = padNewLine(str, style.maxCharsPerCol, "[".concat(style.spliterNewLine, "]+"));
            str = str.replace(new RegExp("\n+", 'g'), style.newLineReplacement); //換行最終使用字符 <br />
            break;
    }
    var pages = (_a = str.match(new RegExp(".{1,".concat(charsPerPage, "}"), 'g'))) !== null && _a !== void 0 ? _a : []; //分頁
    //console.debug(pages);
    //console.debug(pages.length);
    if (pages.length > 0)
        pages[pages.length - 1] = pages[pages.length - 1].padEnd(charsPerPage, style.SPACE); //分頁後，末頁補空白
    for (var i = 0; i < pages.length; i++) {
        retStr += style.newLineReplacement;
        for (var x = 0; x <= style.maxColsPerPage; x++) { //header
            switch (x) {
                case 0:
                    retStr += style.cornerTopLeft;
                    break;
                case style.maxColsPerPage:
                    retStr += style.borderHorizontal + style.cornertopRight;
                    break;
                default:
                    retStr += style.borderHorizontal + style.spliterVerticalTop;
                    break;
            }
        }
        retStr += style.newLineReplacement;
        //console.debug(pages[i]);
        for (var y = 0; y < style.maxCharsPerCol; y++) { //body
            for (var x = pages[i].length - style.maxCharsPerCol + y, c = 1; x >= 0; x -= style.maxCharsPerCol, c++) {
                switch (c) {
                    case 1:
                        retStr += style.borderVertical + pages[i][x];
                        break;
                    case style.maxColsPerPage:
                        retStr += style.spliterVertical + pages[i][x] + style.borderVertical;
                        break;
                    default:
                        retStr += style.spliterVertical + pages[i][x];
                        //if (c === style.maxColsPerPage-1) retStr += style.borderVertical; //case style.maxColsPerPage-1:
                        break;
                }
            }
            retStr += style.newLineReplacement;
        }
        for (var x = 0; x <= style.maxColsPerPage; x++) { //footer
            switch (x) {
                case 0:
                    retStr += style.cornerBottomLeft;
                    break;
                case style.maxColsPerPage:
                    retStr += style.borderHorizontal + style.cornerBottomRight;
                    break;
                default:
                    retStr += style.borderHorizontal + style.spliterVerticalBottom;
                    break;
            }
        }
    }
    retStr = retStr.replace(/「/g, '﹁').replace(/」/g, '﹂').replace(/『/g, '﹃').replace(/』/g, '﹄');
    return retStr;
}
exports.toVerticalWriting = toVerticalWriting;
