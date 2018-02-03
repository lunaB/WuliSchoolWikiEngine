/* 우리학교 위키엔진 */
/* wuri school wiki engine */
/* lunaB */

/* test */

function start() {
    var mark = document.getElementById("textarea");
    var lexerTokens = lexer.process(mark.value);
    renderer.process( lexerTokens );
}

var lexer = new Lexer();

function Lexer() {

    // [정규식] 검출 순위별로 나열한다.
    var regExp = {
        
        // 우선적 처리
        important: {
            // 이스케이프
            escape: /\\/,    
        },
        
        // 라인검출
        line: {
            title: /^([#]{1,6})\s(.+)$/, // 타이틀
            list: /^(\s?)-\s(.+)$/, // 리스트 or 서브 리스트
        },
        // 고정 ( 라인검출 )
        static: {
            contents: /^\[\[\[목차\]\]\]$/, // 자동생성 목차
        },
        // 텍스트검출 ( 감싸는 문법 )
        cover: {
            bold: /""(.+?)""/g, // 두껍게
            localLink: /\[\[(.+?)\]\]/g, // 로컬 링크
            strikethrough: /~~(.+?)~~/g, // 취소선
            underline: /__(.+?)__/g, // 밑줄
            italic: /\/\/(.+?)\/\//g, // 기울게 
        },
        // 일반 텍스트 ( 감싸는 문법에서 검출될 첫 특수기호 추가 )
        common: {
            //text: /^.+?(?=[\"\[\~\_\/])/
        }
        // 함수
        // 변수
    };

    // [메인] 
    this.process = function( text ) {

        var lines = text.split( "\n" );
        var tokens = [];
        var idx = 0;
        
        while( idx < lines.length ) {
            var line = lines[idx];
            var idxc = 0;
            
            var block;
            
            /* 라인검출 */
            if( block = regExp.line.title.exec( line ) ) {
                tokens.push({
                    type: 'title',
                    level: block[1].length,
                    value: block[2]
                });
            }
            else if( block = regExp.line.list.exec( line ) ) {
                tokens.push({
                    type: 'list',
                    level: block[1].length,
                    value: block[2]
                });
            }
            
            /* 예약어 검출 */
            else if( block = regExp.static.contents.exec( line ) ) {
                tokens.push({
                    type: 'contents'
                })
            }
            
            /* 일반문자열 */
            else {
                var token = [];
                
                while( block = regExp.cover.bold.exec( line ) ) {
                    token.push({
                        type: 'bold',
                        first: block.index,
                        end: block.index+block[0].length,
                        value: block[1]
                    });
                }
                while( block = regExp.cover.localLink.exec( line ) ) {
                    token.push({
                        type: 'localLink',
                        first: block.index,
                        end: block.index+block[0].length,
                        value: block[1]
                    });
                }
                while( block = regExp.cover.strikethrough.exec( line ) ) {
                    token.push({
                        type: 'strikethrough',
                        first: block.index,
                        end: block.index+block[0].length,
                        value: block[1]
                    });
                }
                while( block = regExp.cover.underline.exec( line ) ) {
                    token.push({
                        type: 'underline',
                        first: block.index,
                        end: block.index+block[0].length,
                        value: block[1]
                    });
                }
                while( block = regExp.cover.italic.exec( line ) ) {
                    token.push({
                        type: 'italic',
                        first: block.index,
                        end: block.index+block[0].length,
                        value: block[1]
                    });
                }
                
                if( token.length > 0 ) {
                    token.sort( function( a, b ) {
                        return a.first < b.first ? -1 : 1;
                    });
                    
                    var nTmp = 0;
                    token.forEach( function( e ) {
                        tokens.push({
                            type: 'text',
                            value: line.substring(nTmp, e.first)
                        });
                        nTmp = e.end;
                        tokens.push({
                            type: e.type,
                            value: e.value
                        });
                    });
                    tokens.push({
                        type: 'text',
                        value: line.substring(nTmp, line.length)
                    })
                }
            }
            
            tokens.push({
                type: 'nextLine'
            })
            
            idx++;
        }
    
        console.log("---------------------------------------");
        console.log(tokens);
        tokens.forEach( function( e ) {
            console.log(e);
        });
        
        return tokens;
    }
}

var renderer = new Renderer();
function Renderer() {
    
    this.process = function( tokens ) {
        
    }
    
}

var parser = new Parser();
function Parser() {
    
}
