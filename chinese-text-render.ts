'use strict';

enum ReplacePunctuation {
	keep ='keep',
	space = 'space',
	newcol = 'newcol',
	none = 'none'
}

interface VerticalWritingStyle {
	SPACE: string;
	spliterNewLine: string;
	punctuations: string;
	maxCharsPerCol: number;
	maxColsPerPage: number;
	cornerTopLeft: string;
	cornertopRight: string;
	cornerBottomLeft: string;
	cornerBottomRight: string;
	spliterVerticalTop: string;
	spliterVertical: string;
	spliterVerticalBottom: string;
	borderVertical: string;
	borderHorizontal: string;
	replacePunctuation: ReplacePunctuation;
	newLineReplacement: string;
}

let defaultVerticalWritingStyle: VerticalWritingStyle = {
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
}

function padNewLine(inputStr: string, fixedLength: number, spliterNewLinePattern = `[${defaultVerticalWritingStyle.spliterNewLine}]+`, replacement = '　'): string {
	if (inputStr === null) return '';
	if (inputStr === '') return '';
	let strArray = inputStr.split(new RegExp(spliterNewLinePattern, 'g'));
	for (let i=0; i<strArray.length; i++) {
		let fixedLengthPieces = strArray[i].match(new RegExp(`.{1,${fixedLength}}`, 'g'));
		if (fixedLengthPieces === null) {
			strArray[i] = strArray[i].padEnd(fixedLength, replacement);
		} else {
			fixedLengthPieces[fixedLengthPieces.length-1] = fixedLengthPieces[fixedLengthPieces.length-1].padEnd(fixedLength, replacement);
			strArray[i] = fixedLengthPieces.join('');
		}
	}
	return strArray.join('');
}

function toVerticalWriting(inputStr: string, customStyle: any = {} ): string {
	let style: VerticalWritingStyle = Object.assign({}, defaultVerticalWritingStyle, customStyle);
	let retStr = '';
	retStr += style.newLineReplacement;
	let str = '';
	let charsPerPage = style.maxCharsPerCol*style.maxColsPerPage;
	switch(style.replacePunctuation.toLowerCase()) {
		case 'keep':
			{
				//use block {...} to keep var locally in "switch...case..." if needed
			}
			str = padNewLine(inputStr, style.maxCharsPerCol, `[${style.spliterNewLine}]+`);
			break;
		case 'space':
			str = inputStr.replace(new RegExp(`[${style.spliterNewLine.toString()}]+`, 'g'), '\n');  //換行預處理，比如默認將豎綫也作爲換行符
			str = str.replace(new RegExp(`[${style.punctuations.toString()}]+`,'g'), style.SPACE);  //標點替換
			str = padNewLine(str, style.maxCharsPerCol, `[${style.spliterNewLine}]+`);  //塡充列的空白
			str = str.replace(new RegExp(`\n+`, 'g'), style.newLineReplacement)  //換行最終使用字符 <br />
			break;
		case 'none':
			str = inputStr.replace(new RegExp(`[${style.spliterNewLine.toString()}]+`, 'g'), '\n');
			str = str.replace(new RegExp(`[${style.punctuations.toString()}]+`,'g'), '');
			str = padNewLine(str, style.maxCharsPerCol, `[${style.spliterNewLine}]+`);
			str = str.replace(new RegExp(`\n+`, 'g'), style.newLineReplacement)  //換行最終使用字符 <br />
			break;
		case 'newcol':
			str = inputStr.replace(new RegExp(`[${style.spliterNewLine.toString()}]+`, 'g'), '\n');
			str = str.replace(new RegExp(`[${style.punctuations.toString()}]+`, 'g'), '\n');
			str = padNewLine(str, style.maxCharsPerCol, `[${style.spliterNewLine}]+`);
			str = str.replace(new RegExp(`\n+`, 'g'), style.newLineReplacement)  //換行最終使用字符 <br />
			break;
	}
	let pages = str.match(new RegExp(`.{1,${charsPerPage}}`, 'g')) ?? []; //分頁
	//console.debug(pages);
	//console.debug(pages.length);
	if (pages.length > 0)
	pages[pages.length-1] = pages[pages.length-1].padEnd(charsPerPage, style.SPACE); //分頁後，末頁補空白
	for (let i=0; i<pages.length; i++) {
		retStr += style.newLineReplacement;
		for (let x=0; x<=style.maxColsPerPage; x++) { //header
			switch(x) {
				case 0: retStr += style.cornerTopLeft; break;
				case style.maxColsPerPage: retStr += style.borderHorizontal + style.cornertopRight; break;
				default: retStr += style.borderHorizontal + style.spliterVerticalTop; break;
			}
		}
		retStr += style.newLineReplacement;
		//console.debug(pages[i]);
		for (let y=0; y<style.maxCharsPerCol; y++) { //body
			for (let x=pages[i].length-style.maxCharsPerCol+y, c=1; x>=0; x-=style.maxCharsPerCol, c++) {
				switch(c) {
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
		for (let x=0; x<=style.maxColsPerPage; x++) { //footer
			switch(x) {
				case 0: retStr += style.cornerBottomLeft; break;
				case style.maxColsPerPage: retStr += style.borderHorizontal + style.cornerBottomRight; break;
				default: retStr += style.borderHorizontal + style.spliterVerticalBottom; break;
			}
		}
	}
	retStr = retStr.replace(/「/g,'﹁',).replace(/」/g,'﹂').replace(/『/g,'﹃').replace(/』/g,'﹄');
	return retStr;
}

export { ReplacePunctuation, toVerticalWriting, defaultVerticalWritingStyle };
export type { VerticalWritingStyle };
