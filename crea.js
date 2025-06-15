var myTheme = {
  collapseActivities: true, // Minimize interactive activities
  // Activities (to minify if collapseActivities is true)
  // Activities using any of these icons will be minified too: icon_collapse_idevice
  activities: [
    "RssIdevice",
  ],
  acces_icons: [ "access","highcontrast","typo","zoomout","zoomin","speak","reset"],
  acces_icons_title : ["Accesibilidad","Alto contraste","Cambio tipografía","Disminuir tamaño letra","Aumentar tamaño letra","Leer texto","Reestablecer accesibilidad"],
  typo_fonts: [ ["Atkinson Hyperlegible","Atkinson"], ["Arial","Arial"],["Open Dyslexic","OpenDyslexic"],  ["Infantil","Infantil"]],
  access_enable:0,
  dm_enable : 0,
  zoomLvl : 1.15,
  pts : 0,
  menu_enable : 1,
  typo : "Atkinson", 
  textselected:"",
  textspeaking:"",
  init: function () {
    var ie_v = $exe.isIE();
    if (ie_v && ie_v < 8) return false;

   
    const menu_en = localStorage.getItem("menu_enable");
    if (menu_en != null) myTheme.menu_enable = parseInt(menu_en) ;
   
    var tit = $exe_i18n.menu + " (" + $exe_i18n.hide.toLowerCase() + ")";
    var navToggler = '<p id="header-options">';
    navToggler += 
      '<a href="#top" class="hide-nav" id="toggle-nav" title="' + tit + '">'; 
    navToggler += "<span>" + $exe_i18n.menu + "</span>";
    navToggler += "</a>";
    navToggler += "</p>";
    var l = $(navToggler);
    var nav = $("#siteNav");
    nav.before(l);

    $("#toggle-nav").click(function () {
      myTheme.toggleMenu(this);
      scroll(0,0);
      return false;
    });
    $("#print-page").click(function () {
      window.print();
      return false;
    });
    if ($("A", nav).attr("class").indexOf("active") == 0)
      $("BODY").addClass("home-page");

      if (!myTheme.menu_enable)
       { 
        myTheme.hideMenu();
      }

    // Set the min-height for the content wrapper
    $("#main-wrapper").css("min-height", nav.height() + 25 + "px");
  },
  hideMenu: function () {
    $("#siteNav").hide();
    $(document.body).addClass("no-nav");
    //myTheme.params("add");
    var tit = $exe_i18n.menu + " (" + $exe_i18n.show.toLowerCase() + ")";
    $("#toggle-nav").attr("class", "show-nav").attr("title", tit);
  },
  toggleMenu: function (e) {
    if (typeof myTheme.isToggling == "undefined") myTheme.isToggling = false;
    if (myTheme.isToggling) return false;
   
    var l = $("#toggle-nav");

    if (!e && $(window).width() < 900 && l.css("display") != "none")
      return false; // No reset in mobile view
    if (!e) {
      var tit = $exe_i18n.menu + " (" + $exe_i18n.show.toLowerCase() + ")";
      l.attr("class", "show-nav").attr("title", tit); // Reset
    }

    myTheme.isToggling = true;

    if (l.attr("class") == "hide-nav") {
      var tit = $exe_i18n.menu + " (" + $exe_i18n.show.toLowerCase() + ")";
      l.attr("class", "show-nav").attr("title", tit);
      $("#siteFooter").hide();
      $("#siteNav").slideUp(400, function () {
        $(document.body).addClass("no-nav");
        $("#siteFooter").show();
        myTheme.isToggling = false;
      });
      localStorage.setItem("menu_enable",0);
    } else {
      var tit = $exe_i18n.menu + " (" + $exe_i18n.hide.toLowerCase() + ")";
      l.attr("class", "hide-nav").attr("title", tit);
      $(document.body).removeClass("no-nav");
      $("#siteNav").slideDown(400, function () {
        myTheme.isToggling = false;
      });
      localStorage.setItem("menu_enable",1);
    }
  },
  common: {
    init: function (c) {
      var iDevices = $(".iDevice_wrapper");
      var firstIsText = false;
      iDevices.each(function (i) {
        if (
          iDevices.length > 1 &&
          i == 0 &&
          this.className.indexOf("FreeTextIdevice") != -1
        ) {
          $(".iDevice", this).css("margin-top", 0);
          firstIsText = true;
        }
        // Use common CSS class names (so they have a similar presentation)
        if (!$(this).hasClass("UDLcontentIdevice")) {
          var header = $(".iDevice_header", this);
          var icon = header.css("background-image");
          if (typeof icon == "string") {
            if (icon.indexOf("icon_udl_eng") != -1)
              $(this).addClass("em_iDevice_udl_eng_like");
            if (icon.indexOf("icon_udl_exp") != -1)
              $(this).addClass("em_iDevice_udl_exp_like");
            if (icon.indexOf("icon_udl_rep") != -1)
              $(this).addClass("em_iDevice_udl_rep_like");
          }
        }
      });
      if (myTheme.collapseActivities) {
        var as = myTheme.activities;
        var editor = $("#activeIdevice");
        if (typeof _ != "function" || editor.length != 1) {
          if ($(".iDevice").length > 1) {
            for (var z = 0; z < as.length; z++) {
              var a = as[z];
              // Minimize those iDevices (like clicking on .toggle-idevice a)
              var aW = $(".iDevice_wrapper." + a);
              aW.addClass("hidden-idevice");
              $(".toggle-idevice a", aW).addClass("show-idevice");
              $(".iDevice_inner", aW).hide();
              if (a == "GeoGebra")
                $("div.auto-geogebra", aW).addClass("disableAutoScale"); // Prevent zoom problems when the iDevice is minified
            }
            // The iDevices with the double asterisc ** are minified too
            $(".iDevice_wrapper").each(function () {
              var header = $(".iDeviceTitle", this);
              if (header.length == 1) {
                var text = header.text();
                if (typeof text == "string" && text.startsWith("**") == 1) {
                  var aW = $(this);
                  aW.addClass("hidden-idevice");
                  $(".toggle-idevice a", aW).addClass("show-idevice");
                  $(".iDevice_inner", aW).hide();
                  header.text(header.text().substr(2));
                }
              }
            });

            $(".iDevice_wrapper").each(function () {
              var header = $(".iDevice_header", this);
              if (header.length == 1) {
                var img = header.attr("style");
                //change icons to chevron
                if (
                  typeof img == "string" &&
                  img.indexOf("icon_collapse_idevice") != -1
                ) {
                  var aW = $(this);
                  aW.addClass("hidden-idevice");
                  $(".toggle-idevice a", aW).addClass("show-idevice");
                  $(".iDevice_inner", aW).hide();
                }
              }
            });
            // You can toggle the iDevice clicking on any part of its header
            $(".iDevice_header")
              .click(function () {
                $(".toggle-idevice a", this).addClass("rotation");
				        $(".toggle-idevice a", this).trigger("click");

                var i = $(this).closest(".iDevice");
                if (i.length == 1) {
                  // H5P dynamic size
                  $("iframe", i).each(function () {
                    if (
                      this.src &&
                      (this.src.indexOf("https://h5p.org/") == 0 ||
                        this.src.indexOf(
                          "/wp-admin/admin-ajax.php?action=h5p_embed"
                        ) != -1)
                    ) {
                      if (
                        !this.style ||
                        !this.style.height ||
                        this.style.height == ""
                      ) {
                        this.src = this.src;
                      }
                    }
                  });
                }
              })
              .css("cursor", "pointer");

          }
        }
      }
      // "Do it here" will be the default title of the Interactive Activities
      if (document.body.className.indexOf("exe-authoring-page") == 0) {
        if (typeof top._ != "undefined") {
          var d = [
            "DropDown Activity",
            "SCORM Quiz",
            "Scrambled List",
            "Multi-choice",
            "Multi-select",
            "True-False Question",
            "Cloze Activity",
            "Interactive Video",
            "GeoGebra Activity",
          ];
          var l = [
            "ListaIdevice",
            "QuizTestIdevice",
            "ScrambledListIdevice",
            "MultichoiceIdevice",
            "MultiSelectIdevice",
            "TrueFalseIdevice",
            "ClozeIdevice",
            "interactive-videoIdevice",
            "GeoGebraIdevice",
          ];
          var editor = $("#activeIdevice");
          if (editor.length != 1) return;
          var c = editor.attr("class");
          var i = l.indexOf(c);
          if (i == -1) return;
          var t = $("input[type='text']", editor).eq(0);
          if (t.length != 1) return;
          if (t.val() == _(d[i])) t.val(_("Do it here"));
        }
      }
    },
  }, 
  darkmode: function (dm_enable, sheet,element) {
    if (dm_enable == 1) {
      $("body").addClass("darkmode");
      $("div,article,section,p,a,nav,img,header,h1,h2,h3,h4,h5,span,ul,li,il,ol,table,caption,thead,th,tbody,td,tr,dl,dt,dd").each(function () {
        $(this).addClass("darkmode");
      });
      $("#logoexelarium").css("filter","invert(100%)");
      $(".MQP-MainContainer, .CMPT-MainContainer,.IDFP-MainContainer,.gameQP-MainContainer, .SPP-MainContainer,.FLCDSP-MainContainer,.trivial-MainContainer,.rosco-MainContainer,.exe-interactive-video,.exe-sortableList,.MTHO-MainContainer, .MTHP-GameContainer,.candado-MainContainer,.desafio-MainContainer").each(function () {
        $(this).find("*").removeClass("darkmode"); 
      });
      /* other Games iDevices. Need revision */
      $("CQP-MainContainer, DescubreQP-MainContainer,flip-card, INFMP-MainContainer, gameQEIdeviceForm,CTJP-MainContainer, ODNP-MainContainer,RLCP-MainContainer,SLCMP-MainContainer,VQXTP-MainContainer").each(function () {
        $(this).find("*").removeClass("darkmode"); 
      });

      $("#toggle-nav").removeClass("darkmode");
      var icons = myTheme.acces_icons;
      for (var i = 0; i < icons.length; i++)
        document.getElementById(icons[i]).classList.add("darkmode_icons");
      $("#siteNav ul ul").each(function () {
        $(this).find("li").removeClass("darkmode");
        $(this).find("*").addClass("darkmode_gray");
      });
      $(".pagination a").each(function () {
        $(this).addClass("darkmode_icons_nav");
      });

      $(".iDevice_header p.toggle-idevice a").each(function () {
        $(this).addClass("darkmode_icons_idevice");
      });

      $(".iDevice_wrapper p.toggle-idevice a").each(function () {
        $(this).addClass("darkmode_icons_idevice");
      });
      
      $(".exe-udlContent *[class^='exe-udlContent-alt']").each(function () {
        $(this).addClass("darkmode_icons_udl");
      });        

      if($("#main-wrapper").length)
        document.getElementById("main-wrapper").classList.add("darkmode_back");
      document.getElementById("nodeDecoration").classList.add("darkmode_back");

      let stl =
        "#nodeDecoration.darkmode_back {background: white !important;background-image: none !important; background-color:  #000 !important; background: black !important;}";
      stl +=
        " .pagination a.darkmode_icons_nav{ background-image:url(_escolares_nav_iconsDM.png) !important;}";
      stl +=
        " .iDevice_header p.toggle-idevice a.darkmode_icons_idevice {background-image:url(_escolares_iconsDM.png) !important;}";
      sheet.innerHTML = stl;
      document.head.appendChild(sheet); 
    } else {
      if ($("body").hasClass("darkmode")) {
        $("body").removeClass("darkmode");
        $("div,article,section,p,a,nav,img,header,h1,h2,h3,h4,h5,span,ul,li,il,ol,table,caption,thead,th,tbody,td,tr,dl,dt,dd").each(function () {
          $(this).removeClass("darkmode");
        });
        $("#logoexelarium").css("filter","");
        var icons = myTheme.acces_icons;
        for (var i = 0; i < icons.length; i++)
          document.getElementById(icons[i]).classList.toggle("darkmode_icons");

        $("#siteNav ul ul").each(function () {
          $(this).find("li").removeClass("darkmode");
          $(this).find("*").removeClass("darkmode_gray");
        });
        $(".pagination a").each(function () {
          $(this).removeClass("darkmode_icons_nav");
        });
        $(".darkmode_icons_idevice").each(function () {
          $(this).removeClass("darkmode_icons_idevice");
        });
        $(".exe-udlContent *[class^='exe-udlContent-alt']").each(function () {
          $(this).removeClass("darkmode_icons_udl");
        });
        if($("#main-wrapper").length)
          document.getElementById("main-wrapper").classList.remove("darkmode_back");
        document.getElementById("nodeDecoration").classList.remove("darkmode_back");

        sheet.disabled = true;
        sheet.parentNode.removeChild(sheet);
      }
    }
  },
  startSpeak: function(text) {
    document.getElementById("reset").classList.remove("ocultar"); 
    const message = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(message);
    myTheme.textspeaking=text;
    message.onend = function (event) {
      myTheme.textspeaking="";
      myTheme.textselected="";
      if ( myTheme.dm_enable == 0  && myTheme.zoomLvl == 1.15 && myTheme.typo=="Atkinson") document.getElementById("reset").classList.add("ocultar");
    };
  },
  texttospeech: function (text) {
    if (window.speechSynthesis.speaking) {
      if (text==myTheme.textspeaking)
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
           else window.speechSynthesis.pause();
      else {
        window.speechSynthesis.cancel();
        setTimeout(function(){
          myTheme.startSpeak(text);
		    },500);
      } 
    } else myTheme.startSpeak(text);
  },
  updtZoom : function (zoom, points,element) {
    if ((myTheme.zoomLvl >= 2.35 && zoom < 0) || (myTheme.zoomLvl <= 0.45 && zoom > 0) ||
        (myTheme.zoomLvl < 2.35 && myTheme.zoomLvl > 0.45) || (myTheme.zoomLvl <= 2.35 && myTheme.zoomLvl >= 0.45 && zoom==0) ) 
        {
          myTheme.zoomLvl =parseFloat((myTheme.zoomLvl+ zoom).toFixed(2));
          myTheme.pts += points;
          $("body *[style*='font-size']").each(function () {
            $(this).css(
              "font-size",
              parseInt($(this).css("font-size"), 10) + points
            );
          });
          if (element == "nodeDecoration")
            $(".iDevice_wrapper").css({ "font-size": myTheme.zoomLvl + "em" });
          else $("body").css({ "font-size": myTheme.zoomLvl + "em" });
    }
  },
  access_init: function (element) {
    if (localStorage.getItem("darkmode") == "1") myTheme.dm_enable = 1;
    else myTheme.dm_enable = 0;

    if (localStorage.getItem("access_enable") == "1")  myTheme.access_enable = 1;
    else myTheme.access_enable = 0;

    const zoom_level = localStorage.getItem("zoomLvl");
    if (zoom_level != null) myTheme.zoomLvl = parseFloat(zoom_level);

    const pts_level = localStorage.getItem("pts");
    if (pts_level != null) myTheme.pts = parseInt(pts_level);

    const typo_ini = localStorage.getItem("typo");
    if (typo_ini != null) myTheme.typo = typo_ini; 
 
    var sheetDM = document.createElement("style");
    $exe.iDeviceToggler.toggle = function (e, t, n) {
	    e.classList.add("rotation");	

      if (myTheme.dm_enable==1) dark=" darkmode_icons_idevice ";
      else dark="";
      var r = $exe_i18n.hide;
      var i = $("#" + t);
      var s = ".iDevice_content";
      if (n == "em1") s = ".iDevice_inner";
      var o = $(s, i);
      var u = i.attr("class");
      if (typeof u == "undefined") return false;
      if (u.indexOf(" hidden-idevice") == -1) {
        r = $exe_i18n.show;
        u += " hidden-idevice";
        o.slideUp("fast", function () {
          e.className = "show-idevice" + dark;
          e.title = r;
          e.innerHTML = "<span>" + r + "</span>";
          i.attr("class", u);
        });
      } else {
        u = u.replace(" hidden-idevice", "");
        o.slideDown("fast", function () {
          e.className = "hide-idevice" + dark;
          e.title = r;
          e.innerHTML = "<span>" + r + "</span>";
        });
        i.attr("class", u);
      }
    };

    var icons = myTheme.acces_icons;
    var icons_title = myTheme.acces_icons_title;
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      const elem = document.createElement("a");
      elem.id = icon;
      elem.innerText = "";
      elem.title=icons_title[i]; 
      const span = document.createElement('span');
      span.innerText=icons_title[i];
      span.style="visibility:hidden";
      elem.appendChild(span);      
 
      if (icon !== "access" && icon!="reset" && myTheme.access_enable==0 ) elem.className = "ocultar";
      else 
        if (icon=="reset" && (myTheme.access_enable==0 || (myTheme.access_enable==1 && (myTheme.dm_enable == 0 &&  myTheme.zoomLvl == 1.15 && myTheme.typo=="Atkinson" )))) 
            elem.className = "ocultar";
      document.getElementById(element).appendChild(elem);
    }

    const typobox = document.createElement("div");
    typobox.id = "typobox";
    typobox.classList.add("typobox");
    typobox.classList.add("ocultar");
    document.getElementById(element).appendChild(typobox);  
    
    var typos = myTheme.typo_fonts;
    for (var i = 0; i < typos.length; i++) {
      var tfont = typos[i][0];
      const elem = document.createElement("a");
      elem.id = typos[i][1];
      elem.innerText = typos[i][0];
      elem.style="cursor: pointer";

      document.getElementById("typobox").appendChild(elem);  
      $("#"+typos[i][1]).click(function() { 

        $("body").removeClass(myTheme.typo);
        $("body").addClass(this.id); 
    
        $("body *[style*='font-family']").each(function () {
          $(this).css({"font-family":this.id});
        });

        myTheme.typo=this.id; 
        localStorage.setItem("typo",myTheme.typo);
        if (( myTheme.dm_enable == 1  || myTheme.zoomLvl != 1.15 || myTheme.typo!="Atkinson" ))  document.getElementById("reset").classList.remove("ocultar");
        else document.getElementById("reset").classList.add("ocultar");

        document.getElementById("typobox").classList.add("ocultar");
      }); 
    }
    $("body").addClass(myTheme.typo); 

    $("#access").click(function () {
      var icons = myTheme.acces_icons;

      if (myTheme.access_enable==0) {
        myTheme.access_enable=1; 
        if($("#nodeDecoration.logocrea").length) $("#nodeDecoration.logocrea").css('background-image', 'unset');
        if(window.matchMedia("(min-width: 50px) and  (max-width: 768px)").matches && $("#siteNav").length) {
            document.getElementById("siteNav").style.top = "100px";
            document.getElementById("exe-client-search-form").style.paddingTop = "100px"; 
        }
      } else { 
        myTheme.access_enable=0;
        if($("#nodeDecoration.logocrea").length) $("#nodeDecoration.logocrea").css('background-image','url(exe.png)');
        if(window.matchMedia("(min-width: 50px) and  (max-width: 768px)").matches && $("#siteNav").length) {
           document.getElementById("siteNav").style.top = "50px";
          if($("#exe-client-search-form").length)
            document.getElementById("exe-client-search-form").style.paddingTop = "50px"; 
        }
      }
      localStorage.setItem("access_enable",myTheme.access_enable);
      for (var i = 1; i < icons.length; i++) {
        $("#" + icons[i]).slideToggle("fast");
        
        setTimeout(function(icons1){
          if (icons1!== "reset")
              if (myTheme.access_enable==1) 
                document.getElementById(icons1).classList.remove("ocultar");
              else
                document.getElementById(icons1).classList.add("ocultar");
          else 
              if (( myTheme.dm_enable != 0 || myTheme.zoomLvl != 1.15 || myTheme.typo!="Atkinson") && (myTheme.access_enable==1)  ) 
                    document.getElementById(icons1).classList.remove("ocultar");
        }
       ,100,icons[i]);
      }    
  
    });

    $("#reset").click(function () {
      myTheme.dm_enable = 0;
      myTheme.zoomLvl = 1.15;
      myTheme.pts=0;
      $("body").removeClass(myTheme.typo);
      myTheme.typo="Atkinson";
      if (window.speechSynthesis.speaking) 
        window.speechSynthesis.cancel(); 

      document.getElementById("typobox").classList.add("ocultar");

      myTheme.darkmode(myTheme.dm_enable, sheetDM);
      myTheme.updtZoom(0,0,element);
      document.getElementById("reset").classList.add("ocultar")
      localStorage.setItem("darkmode", myTheme.dm_enable);
      localStorage.setItem("zoomLvl", myTheme.zoomLvl.toString());
      localStorage.setItem("pts", myTheme.pts.toString());
      localStorage.setItem("typo", myTheme.typo.toString());
      localStorage.setItem("load_page","");
      $("#access").trigger("click");
    });

    myTheme.darkmode(myTheme.dm_enable, sheetDM);  
    $("#highcontrast").click(function () {

      if (myTheme.dm_enable ==0 ) myTheme.dm_enable=1; else myTheme.dm_enable=0;
      myTheme.darkmode(myTheme.dm_enable, sheetDM);
      localStorage.setItem("darkmode", myTheme.dm_enable);
      if (( myTheme.dm_enable == 1  || myTheme.zoomLvl != 1.15 || myTheme.typo!="Atkinson" ))  document.getElementById("reset").classList.remove("ocultar");
      else document.getElementById("reset").classList.add("ocultar");
    });
 
    document.addEventListener('selectionchange', () => {
        if (window.getSelection().toString()!="" && window.getSelection().toString()!=null)
        myTheme.textselected=window.getSelection().toString();
    });
    
    $("#speak").on("click",function () {  
        if (myTheme.textselected.length>1) myTheme.texttospeech(myTheme.textselected);
        else if (document.getElementById("main-wrapper"))   myTheme.texttospeech(document.getElementById("main-wrapper").innerText);
        else  myTheme.texttospeech(document.getElementById("main").innerText);

    });

    $("#typo").click(function () {
      document.getElementById("typobox").classList.toggle("ocultar");
    });

    $("#zoomin").click(function () {
      myTheme.updtZoom(0.1, 2,element);
      localStorage.setItem("zoomLvl", myTheme.zoomLvl.toString());
      localStorage.setItem("pts", myTheme.pts.toString());
      if (( myTheme.dm_enable == 1  || myTheme.zoomLvl != 1.15 || myTheme.typo!="Atkinson"))  document.getElementById("reset").classList.remove("ocultar");
      else     document.getElementById("reset").classList.add("ocultar");
    });

    $("#zoomout").click(function () {
      myTheme.updtZoom(-0.1, -2,element);
      localStorage.setItem("zoomLvl", myTheme.zoomLvl.toString());
      localStorage.setItem("pts", myTheme.pts.toString());
      if (( myTheme.dm_enable == 1  || myTheme.zoomLvl != 1.15 || myTheme.typo!="Atkinson")) document.getElementById("reset").classList.remove("ocultar");
      else document.getElementById("reset").classList.add("ocultar");
    });

    myTheme.updtZoom(0,0,element);
  },
  delete_first_word_pagecounter: function () {
    document.getElementsByClassName("page-counter")[0].innerHTML = document
      .getElementsByClassName("page-counter")[0]
      .innerHTML.replace("Página", "");
    document.getElementsByClassName("page-counter")[1].innerHTML = document
      .getElementsByClassName("page-counter")[1]
      .innerHTML.replace("Página", "");
  }, 
  insert_logos: function () {
    if ($("body").hasClass("exe-web-site")) {
      const logocrea = document.createElement("img");
      logocrea.src = "exe.png";
      logocrea.id = "logoexelarium";
      document.getElementById("siteNav").prepend(logocrea);

    } else {
      $("#nodeDecoration").addClass("logocrea");
    }
  },
  addPageCounter: function () {
    var html = "<span><strong>$a de $b</strong></span>";
    var as = $("#siteNav a");
    html = html.replace("$b", as.length);
    $("#siteNav a").each(function (i) {
      if ($(this).hasClass("active")) html = html.replace("$a", i + 1);
    });
    $("#bottomPagination nav").prepend(html);
    $("#topPagination nav").prepend(html);
    $("#topPagination nav span").addClass("page-counter");
    $("#bottomPagination nav span").addClass("page-counter");
  },
  //Control the fullScreen to web export in exeweb Moodle plugin
  controlfullscreen: function () {
    window.top.addEventListener("fullscreenchange", fullscreenchanged);
    window.top.addEventListener('webkitfullscreenchange', fullscreenchanged);
    window.top.addEventListener('mozfullscreenchange', fullscreenchanged);
    window.top.addEventListener('MSFullscreenChange', fullscreenchanged);

    function fullscreenchanged(event) {
      if (window.top.document.fullscreenElement) {
          $('#page-mod-exeweb-view #exewebpage.fullscreen #exewebobject',parent.document).css('max-height', window.outerHeight-70);     
      } else {
        $('#exewebobject',parent.document).css('max-height',''); 

      }
    }
  },
  positioniconsmvl: function () {
    $(window).resize(function() {
      if(!window.matchMedia("(min-width: 50px) and  (max-width: 768px)").matches ) {
          document.getElementById("header-options").style.position = "fixed";
          document.getElementById("topPagination").style.position = "fixed";
          document.getElementById("header-options").style.top = "-10px";
          document.getElementById("topPagination").style.top = "50px";
          document.getElementById('header-options').style.left=document.getElementById('main-wrapper').getBoundingClientRect().left+"px";
          document.getElementById('header-options').style.right=document.getElementById('main-wrapper').getBoundingClientRect().left+"px";
          document.getElementById('topPagination').style.left=-document.getElementById('main-wrapper').getBoundingClientRect().left+"px";
          }
      });
  },
  hideElementsByCode: function ()
  {
    $("a[id^='exe-udlContent-block-id']").each(function()
     {
      if($(this,"span").text().startsWith("//"))
        {
          $(this).trigger("click");
          $(this).hide();
          $(this).parent().next().removeClass("js-hidden")
        }
     });
  
    $("article.iDevice_wrapper").each(function() {
      var header = $(".iDeviceTitle", this);
      if (header.length == 1) {
        var text = header.text();
        if (typeof text == "string" && text.startsWith("//") == 1) {         
          var aW = $(this);
          aW.addClass("hidebox");
        }
      }

    });
  },
  changeToChevron: function() {
    $("a.exe-dd-toggler").each(function() {
       var lista = $(this); //e
       var text=$("span",this); //s
       text.text(">");  
       text.removeAttr("style");
       text.addClass("exe-dd-chevron");

       lista.unbind('click');
       lista.unbind('click').on("click",function() {
        var dd = lista.parent().next("dd");
        if (lista.hasClass("exe-dd-toggler-closed")) {
          lista.removeClass("exe-dd-toggler-closed");
          text.addClass("exe-dd-chevron-open");
          dd.show();
        } else {
          lista.addClass("exe-dd-toggler-closed");
          text.removeClass("exe-dd-chevron-open"); 
          dd.hide();
        }
        return false;
      }
      );

    });
    $("a.fx-accordion-title").each(function(){
      $(this).on("click", function () {
        $("h2",this).toggleClass("rotate90");
        $("a.fx-accordion-title").each(function(){
          if(!$(this).hasClass("active"))
            $("h2",this).removeClass("rotate90");
        });
      });

    });
  }
};
$(function () {
  if ($("body").hasClass("exe-web-site")) {
    myTheme.init(); 
    if ($("#topPagination nav span.page-counter").length > 0)    //myTheme.addPageCounter();
      myTheme.delete_first_word_pagecounter();
    myTheme.insert_logos();
    myTheme.access_init("header-options");

    document.addEventListener("click", function(e){
      var clic = e.target;
      var div=document.getElementById('typobox'); 
      if(!div.classList.contains("ocultar") && clic.id != "typobox" && clic.id !="typo") 
       div.classList.add("ocultar");
    });


    const mainw = document.getElementById('main-wrapper');
    mainw.addEventListener('click', (event) => {
    if (event.target === mainw) {
      myTheme.toggleMenu(this);
    }
  });

    myTheme.controlfullscreen();
    myTheme.positioniconsmvl();
  } else {
    if (!$("body").hasClass("exe-authoring-page")) 
       myTheme.access_init("nodeDecoration");
    else
      window.onclick = function () {
        if ($("div.mce-tinymce.mce-fullscreen").length > 0) {
          $("#nodeDecoration").hide();
        } else $("#nodeDecoration").show();
      };
    myTheme.insert_logos();
 }

 myTheme.hideElementsByCode();
 myTheme.changeToChevron();
 myTheme.common.init();

  if (myTheme.access_enable==1) {
    if($("#nodeDecoration.logocrea").length) $("#nodeDecoration.logocrea").css('background-image', 'unset');
    if(window.matchMedia("(min-width: 50px) and  (max-width: 768px)").matches && $("#siteNav").length) {
      document.getElementById("siteNav").style.top = "100px";
      document.getElementById("nodeDecoration").style.paddingTop = "0px"; 
      if($("#exe-client-search-form").length)
        document.getElementById("exe-client-search-form").style.paddingTop = "100px"; 
        
    }
  }
  
  document.body.style.visibility="visible";

});

/*!
 * ScrewDefaultButtons v2.0.6
 * http://screwdefaultbuttons.com/
 *
 * Licensed under the MIT license.
 * Copyright 2013 Matt Solano http://mattsolano.com
 *
 * Date: Mon February 25 2013
 */ 

/* SCORM: When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
  if ($("body").hasClass("exe-scorm") || $("body").hasClass("exe-authoring-page") ) {
    var sm = window.matchMedia("(min-width: 50px) and  (max-width: 768px)");

    if (!sm.matches) {
      document.getElementById("nodeDecoration").style.position = "fixed";
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("nodeDecoration").style.top = "0";
      } else {
        document.getElementById("nodeDecoration").style.top = "-70px";
      }
      prevScrollpos = currentScrollPos;
    } else {
      document.getElementById("nodeDecoration").style.position = "absolute";
      document.getElementById("nodeDecoration").style.top = "0px";
    }
  }  else if($("body").hasClass("exe-web-site")) {

    var sm = window.matchMedia("(min-width: 50px) and  (max-width: 768px)");

     if (!sm.matches) {
      document.getElementById("header-options").style.position = "fixed";
      document.getElementById("topPagination").style.position = "fixed";
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("header-options").style.top = "-10px";
        document.getElementById("topPagination").style.top = "50px";
        document.getElementById('header-options').style.left=document.getElementById('main-wrapper').getBoundingClientRect().left+"px";
        document.getElementById('header-options').style.right=document.getElementById('main-wrapper').getBoundingClientRect().left+"px";  
        document.getElementById('topPagination').style.left=-document.getElementById('main-wrapper').getBoundingClientRect().left+"px";
      } else {
        document.getElementById("header-options").style.top = "-100px";
        document.getElementById("topPagination").style.top = "-100px";
        $("#typobox").addClass("ocultar");
      }
      prevScrollpos = currentScrollPos;
    } else {
      document.getElementById("header-options").style.position = "fixed";
      document.getElementById("topPagination").style.position = "fixed";
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("header-options").style.top = "0px";
        document.getElementById("topPagination").style.top = "50px";
      } else {
        document.getElementById("header-options").style.top = "-100px";
        document.getElementById("topPagination").style.top = "-100px";
      }
      prevScrollpos = currentScrollPos;
    }    
  }
};



