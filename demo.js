const { toVerticalWriting } = require('./chinese-text-render.js');
//{ ReplacePunctuation, VerticalWritingStyle, toVerticalWriting, defaultVerticalWritingStyle }


let testStr = '|範仲淹|剔銀燈|||與歐陽公席上分題|昨夜因看蜀志。笑曹操﹑孫權﹑劉備。用盡機關﹐徒勞心力﹐只得三分天地。屈指細尋思﹐爭如共﹑劉伶一醉。人世都無百歲。少癡騃﹑老成尫悴。只有中間﹐些子少年﹐忍把浮名牽系。一品與千金﹐問白髮﹑如何回避。 ';


//可在 defaultVerticalWritingStyle 基礎上更改
let verticalWritingStyle = {
	SPACE: '　',
	spliterNewLine: '\n\|',
	punctuations: '。﹐﹑﹔﹕﹖﹗' + '﹐﹑﹔﹕﹖﹗' + ' \|\t' + '\'\"\`‘’“”「」『』《》〈〉«»‹›',
	maxCharsPerCol: 8,
	maxColsPerPage: 24,
	cornerTopLeft: '╔',
	cornertopRight: '╗',
	cornerBottomLeft: '╚',
	cornerBottomRight: '╝',
	spliterVerticalTop: '╤',
	spliterVertical: '╎',
	spliterVerticalBottom: '╧',
	borderVertical: '║',
	borderHorizontal: '══',
	replacePunctuation: 'newcol',
	newLineReplacement: '\n'
}

console.log(testStr);
console.log(toVerticalWriting(testStr, verticalWritingStyle));
