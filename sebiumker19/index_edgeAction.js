
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"${_Symbol_1}","swipeleft",function(sym,e){sym.$("Symbol_1").hide();sym.getSymbol("Symbol_1").stop("first");sym.$("Symbol_2").show();sym.getSymbol("Symbol_2").play("start");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Symbol_2}","swipeleft",function(sym,e){sym.$("Symbol_2").hide();sym.getSymbol("Symbol_2").stop("first");sym.$("Symbol_3").show();sym.getSymbol("Symbol_3").play("start");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Symbol_2}","swiperight",function(sym,e){sym.$("Symbol_2").hide();sym.getSymbol("Symbol_2").stop("first");sym.$("Symbol_1").show();sym.getSymbol("Symbol_1").play("start");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Symbol_3}","swipeleft",function(sym,e){sym.$("Symbol_3").hide();sym.getSymbol("Symbol_3").stop("first");sym.$("Symbol_4").show();sym.getSymbol("Symbol_4").play("start");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Symbol_3}","swiperight",function(sym,e){sym.$("Symbol_3").hide();sym.getSymbol("Symbol_3").stop("first");sym.$("Symbol_2").show();sym.getSymbol("Symbol_2").play("mid");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Symbol_4}","swiperight",function(sym,e){sym.$("Symbol_4").hide();sym.getSymbol("Symbol_4").stop("first");sym.$("Symbol_3").show();sym.getSymbol("Symbol_3").play("mid");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("Symbol_1").play("start");});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'Symbol_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop();});
//Edge binding end
})("Symbol_1");
//Edge symbol end:'Symbol_1'

//=========================================================

//Edge symbol: 'Symbol_2'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop();});
//Edge binding end
})("Symbol_2");
//Edge symbol end:'Symbol_2'

//=========================================================

//Edge symbol: 'Symbol_3'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop();});
//Edge binding end
})("Symbol_3");
//Edge symbol end:'Symbol_3'

//=========================================================

//Edge symbol: 'Symbol_4'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop();});
//Edge binding end
})("Symbol_4");
//Edge symbol end:'Symbol_4'
})(jQuery,AdobeEdge,"EDGE-144335490");