
function log(msg) {
    //console.log(msg);
}
function fit_image(img, w, h, imgw, imgh) {
    var i = img;
    var wi = imgw || i.naturalWidth || i.width;
    var wc = w;
    var hi = imgh || i.naturalHeight || i.height;
    var hc = h;
    var wr = (wi*1.0)/wc;
    var hr = (hi*1.0)/hc;
    var r = wr < hr ? hr : wr;
    var fw = wi/r;
    var fh = hi/r;
    log("fit_image(img=" + img 
	+ ", w=" + w 
	+ ", h=" + h 
	+ ", imgw=" + imgw
	+ ", imgh=" + imgh
	+ "):"
	+ " wi=" + wi
	+ ", hi=" + hi
	+ ", wr=" + wr
	+ ", hr=" + hr
	+ ", r=" + r
	+ ", fw=" + fw
	+ ", fh=" + fh
	); 

    if ( r >  0 ) {
	$(img).width(fw);
	$(img).height(fh);
    }
}
function gallery() {
  function fit_fullimage(img, imgw, imgh) {
    if (img) {
	var wh = $(window).height();
	var th = $("#top").height();
	var h = (wh - th - 30.0) * 1.0;
	var bw = $("#below").width();
	var blw = $("#below .left").width();
	var brw = $("#below .right").width();
	var mz = blw+brw;
	var w = ( bw - blw - brw -10 );
	if ( w < 400 )
	    w = bw;
	log("wh=" + wh + ", th=" + th + ", h = " + h
	    + ", bw=" + bw + ", blw=" + blw + ", brw=" + brw
	    + ", w=" + w);
	fit_image(img, w, h, imgw, imgh);
    }
  }
  $(window).resize(function(){
    fit_fullimage($("#fullimage-container img")[0]);
  });
  $("#imagelist").jcarousel({
    "scroll": 1,
    "auto": 2, 
    "initCallback": function(c) {
      function stopAutomation() { c.startAuto(0); };
        c.buttonNext.bind('click', stopAutomation);
        c.buttonPrev.bind('click', stopAutomation);
        c.clip.hover(function(){c.stopAuto()}, function(){c.startAuto()});
    }
  });
  var grpItems = new Array();
  $("ul.preview > li > a").each(function(i) {   
   var x = $(this);
   var xi = $("img", x);
   var href = x.attr("href");
   var title = x.attr("title");
   var y = $("<a>").attr("href", href);
   var yi = $("<img>")
       .attr({"src": href,
	      "alt": "LOADING...",
	      "title": title, 
	      "id": href});
   var node = y.append(yi);
   var img = new Image();
   img.onload = function() {
       yi.attr('alt', yi.attr('title'));
       fit_fullimage(yi[0], img.width, img.height);
   }
   img.src = href;
   function show_this() {
       var oldw = img.width;
       fit_fullimage(yi[0], img.width, img.height);
       $("#fullimage-container").empty().append(node);
       yi.fancybox({"itemArray": grpItems, "itemCurrent": i});
   };
   xi.mouseover(show_this);
   var item = {
       "href": href,
       "title": title,
       "src": href,
       "node": node
   };
   grpItems.push(item);
   xi.fancybox({"itemArray": grpItems, "itemCurrent": i});
   yi.fancybox({"itemArray": grpItems, "itemCurrent": i});
   if ( i == 0 )
     show_this();
  });
}
