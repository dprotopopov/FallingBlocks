
FallingBlocks.View1 = function(params) {
    var viewModel = {
        score: ko.observable(0),
        level: ko.observable(1),
        lines: ko.observable(0),
        info: ko.observable(""),
        blevel: ko.observable(1),
    };

    var startClicked = function() {
        startme();
    };
    var pauseClicked = function() {
        pause();
    };

    var leftClicked = function() {
        move(-1);
    };

    var rotateClicked = function() {
        rotate("l");
    };

    var rightClicked = function() {
        move(1);
    };

    var downClicked = function() {
        move(10);
    };
    var aboutClicked = function() {
        describe(about);
    };
    var helpClicked = function() {
        describe(help);
    };
    var showOverlay = function() {
        viewModel.overlayVisible(true);
    };
    var hideOverlay = function() {
        viewModel.overlayVisible(false);
    };

    var scoreInfo = ko.computed(function() {
        return "Score:" + viewModel.score();
    });

    var levelInfo = ko.computed(function() {
        return "Level:" + viewModel.blevel();
    });

    var linesInfo = ko.computed(function() {
        return "Lines:" + viewModel.lines();
    });

    var accelerometer = ko.observable(true);

    viewModel = $.extend(viewModel, {
        title: ko.observable('Falling Blocks'),
        l: ko.observable('j'),
        r: ko.observable('l'),
        p: ko.observable('p'),
        rot: ko.observable('k'),
        down: ko.observable(','),
        speeds: [
            { id: 0, option: "Just learning!" },
            { id: 1, option: "Beginner" },
            { id: 2, option: "Intermediate" },
            { id: 3, option: "Expert" },
            { id: 4, option: "Suicide" },
            { id: 5, option: "Ya! Right!" }
        ],
        //  Put the binding properties here
        accelerometer: accelerometer,

        startClicked: startClicked,
        pauseClicked: pauseClicked,
        leftClicked: leftClicked,
        rotateClicked: rotateClicked,
        rightClicked: rightClicked,
        downClicked: downClicked,
        aboutClicked: aboutClicked,
        helpClicked: helpClicked,

        overlayVisible: ko.observable(false),
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,

        viewShown: function () {
            var pix = Math.floor(Math.min($(window).width() / 10, ($(window).height() - $("#topToolbar").height() - $("#bottomToolbar").height()) / 22));
            var $center = $("<center></center>").appendTo("#tetris");
            var z = 1;
            for (var y = -2; y < 20; y++) {;
                for (var x = 0; x < 10; x++) {;
                    $center.append("<a href=#top><img id='" + z + "' src='white.gif' border=0 width=" + pix + " height=" + pix + "></a>");
                    blckfilled[z] = 0;
                    z += 1;
                };
                $center.append("<br>");
            };

            setTimeout(aboutClicked, 10);
            setTimeout(helpClicked, 4000);

            function deviceMotionHandler(eventData) {
                if (accelerometer()) {
                    var rotationRate = eventData.rotationRate;
                    if (rotationRate.alpha < -30) leftClicked();
                    if (rotationRate.alpha > 30) rightClicked();
                }
            }
            
            if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
                window.addEventListener('devicemotion', deviceMotionHandler, false);
            }

            $(window).resize(function() {
                var pix = Math.floor(Math.min($(window).width() / 10, ($(window).height() - $("#topToolbar").height() - $("#bottomToolbar").height()) / 22));
                $("img", "#tetris").each(function (index, element) {
                    $(element).attr("width", pix);
                    $(element).attr("height", pix);
                });
            });
        },

        topToolbarItems: [
            { location: 'center', text: scoreInfo },
            { location: 'center', text: levelInfo },
            { location: 'center', text: linesInfo }
        ],
        bottomToolbarItems: [
            { location: 'before', widget: 'button', options: { icon: 'arrowleft', clickAction: leftClicked } },
            { location: 'before', widget: 'button', options: { icon: 'arrowdown', clickAction: downClicked } },
            { location: 'center', widget: 'button', options: { icon: 'runner', clickAction: startClicked } },
            //{ location: 'center', widget: 'button', options: { icon: 'info', clickAction: aboutClicked } },
            //{ location: 'center', widget: 'button', options: { icon: 'help', clickAction: helpClicked } },
            { location: 'center', widget: 'button', options: { icon: 'preferences', clickAction: showOverlay } },
            { location: 'center', widget: 'button', options: { icon: 'clock', clickAction: pauseClicked } },
            { location: 'after', widget: 'button', options: { icon: 'refresh', clickAction: rotateClicked } },
            { location: 'after', widget: 'button', options: { icon: 'arrowright', clickAction: rightClicked } }
        ],
    });

    var x = 0;
    var y = 0;
    var z = 1;
    var t = 0;
    var spd = 500;
    var spd2 = 20;
    var spdh = 10;
    var sp = 10;
    var blv = 1;
    var lns = 0;
    var ptb = 5;
    var ptl = 100;
    var acl = 10;
    var rindex = 0;
    var paused = false;
    var nonew = false;
    var getnew = true;
    var started = false;
    var gameover = false;
    var movebad = false;
    var dontgo = true;
    var bomb = false;
    var current = new Array();
    var blckfilled = new Array();
    var hold = new Array();
    var lines = new Array();

    var whtblck = new Image();
    whtblck.src = "white.gif";
    var endblck = new Image();
    endblck.src = "black.gif";
    var explode = new Image();
    explode.src = "explode.gif";

    //*  Definition of the objects for use in the game.;
    function addto(which, zero, one, two, three) {;
        which[0] = zero;
        which[1] = one;
        which[2] = two;
        which[3] = three;
    };

    var obj0 = new Array(); //* Bomb block;
    obj0[0] = new Array();
    addto(obj0[0], -1, 0, 1, 2);
    obj0[1] = new Array();
    addto(obj0[1], -20, -10, 0, 10);
    obj0[2] = new Array();
    addto(obj0[2], 0, 1, -9, -19);
    obj0[3] = new Array();
    addto(obj0[3], -10, -9, 0, 1);
    obj0[4] = new Image();
    obj0[4].src = "bomb.gif";

    var obj1 = new Array(); //* Left Offset block;
    obj1[0] = new Array();
    addto(obj1[0], 11, 10, 0, -1);
    obj1[1] = new Array();
    addto(obj1[1], 19, 10, 9, 0);
    obj1[2] = new Array();
    obj1[2] = obj1[0];
    obj1[3] = new Array();
    obj1[3] = obj1[1];
    obj1[4] = new Image();
    obj1[4].src = "red.gif";

    var obj2 = new Array(); //* Long block;
    obj2[0] = new Array();
    addto(obj2[0], 2, 1, 0, -1);
    obj2[1] = new Array();
    addto(obj2[1], 20, 10, 0, -10);
    obj2[2] = new Array();
    obj2[2] = obj2[0];
    obj2[3] = new Array();
    obj2[3] = obj2[1];
    obj2[4] = new Image();
    obj2[4].src = "blue.gif";

    var obj3 = new Array(); //* Right Offset block;
    obj3[0] = new Array();
    addto(obj3[0], 10, 9, 1, 0);
    obj3[1] = new Array();
    addto(obj3[1], 11, 1, 0, -10);
    obj3[2] = new Array();
    obj3[2] = obj3[0];
    obj3[3] = new Array();
    obj3[3] = obj3[1];
    obj3[4] = new Image();
    obj3[4].src = "purple.gif";

    var obj4 = new Array(); //* L Block;
    obj4[0] = new Array();
    addto(obj4[0], 10, 2, 1, 0);
    obj4[1] = new Array();
    addto(obj4[1], 12, 2, -8, -9);
    obj4[2] = new Array();
    addto(obj4[2], 2, 1, 0, -8);
    obj4[3] = new Array();
    addto(obj4[3], 11, 10, 0, -10);
    obj4[4] = new Image();
    obj4[4].src = "orange.gif";

    var obj5 = new Array(); //* Reverse L block;
    obj5[0] = new Array();
    addto(obj5[0], 12, 2, 1, 0);
    obj5[1] = new Array();
    addto(obj5[1], 12, 11, 2, -8);
    obj5[2] = new Array();
    addto(obj5[2], 2, 1, 0, -10);
    obj5[3] = new Array();
    addto(obj5[3], 10, 0, -9, -10);
    obj5[4] = new Image();
    obj5[4].src = "yellow.gif";

    var obj6 = new Array(); //* Odd block;
    obj6[0] = new Array();
    addto(obj6[0], 10, 1, 0, -1);
    obj6[1] = new Array();
    addto(obj6[1], 10, 0, -1, -10);
    obj6[2] = new Array();
    addto(obj6[2], 1, 0, -1, -10);
    obj6[3] = new Array();
    addto(obj6[3], 10, 1, 0, -10);
    obj6[4] = new Image();
    obj6[4].src = "cyan.gif";

    var obj7 = new Array(); //* Square block;
    obj7[0] = new Array();
    addto(obj7[0], 11, 10, 1, 0);
    obj7[1] = new Array();
    obj7[1] = obj7[0];
    obj7[2] = new Array();
    obj7[2] = obj7[0];
    obj7[3] = new Array();
    obj7[3] = obj7[0];
    obj7[4] = new Image();
    obj7[4].src = "green.gif";


    for (var one = 0; one < 10; one++) {;
        blckfilled[z] = 1;
        z += 1;
    };

    function startme() {;
        if (nonew) return;
        nonew = true;
        getlevel();
        gameover = false;
        paused = false;
        writelevel();
        if (!started) {;
            viewModel.score(0);
        };
        lns = 0;
        viewModel.lines(lns);

        //viewModel.info(viewModel.title());
        //$("#toastContainer").dxToast('instance').show();

        spdh = spd / spd2 - 10;
        newobj();
    };

    function finished() {;

        nonew = false;

        started = false;

        for (var one = 219; one > -1; one--) {;

            if ($("img#" + (one + 1)).attr("src") == whtblck.src) {;

                $("img#" + (one + 1)).attr("src", explode.src);

            };

        };

        if (lna == blv) {;

            viewModel.info("You have defeated " + viewModel.title() + "!  You ARE a GURU!!");
            $("#toastContainer").dxToast('instance').show();

        };

        viewModel.info("Your Game is Over!!! Your Score was " + viewModel.score() + " Click on Start to retry");
        $("#toastContainer").dxToast('instance').show();

        return;

    };


    function newobj() {;

        if (lns >= 20) {

            nextlevel();

            return;

        }

        y = 24;

        rindex = 0;

        dontgo = false;

        rand();

        for (var one = 0; one < 4; one++) {;

            t = y + current[rindex][one];

            if (blckfilled[t] == 1) gameover = true;

            $("img#" + (t + 1)).attr("src", current[4].src);

        };

        getnew = false;

        if (started) return;

        started = true;

        goDown();

    };


    function pause() {;

        if (!started) return;

        if (!paused) {;

            paused = true;

            viewModel.info("Press Pause to Continue");
            $("#toastContainer").dxToast('instance').show();

            return;

        };

        paused = false;

        //viewModel.info(viewModel.title());
        //$("#toastContainer").dxToast('instance').show();

        goDown();

    };


    function goDown() {;
        if (paused) {;
            return;
        };
        sp += 1;
        if (sp > spdh) {;

            if (gameover) {;

                finished();

                return;

            };

            if (paused) return;

            move(10);

            if (getnew) newobj();
            sp = 0;
        };
        setTimeout(goDown, spd2);
    };

    function inpu(eventKey) {
        if (dontgo) return;
        var xx = '';
        xx = eventKey;

        if (xx == viewModel.l()) move(-1);
        if (xx == viewModel.rot()) rotate("l");
        if (xx == viewModel.r()) move(1);
        if (xx == viewModel.down()) move(10);
        if (xx == viewModel.p()) pause();
    };

    document.onkeydown = function(ev) {
        var E = ev || window.event;
        if (!E) return;
        var key = E.which || event.charCode || E.keyCode;
        if (key == 37 || key == 91) {
            // LEFT
            E.preventDefault();
            leftClicked();
        } else if (key == 38 || key == 101) {
            // UP
            E.preventDefault();
            rotateClicked();
        } else if (key == 39 || key == 92) {
            // RIGHT
            E.preventDefault();
            rightClicked();
        } else if (key == 40) {
            // DOWN
            E.preventDefault();
            downClicked();
        } else {
            inpu(String.fromCharCode(key).toLowerCase());
        }
    };


    function rand() {;

        bomb = false;

        var which = Math.random();

        which *= 8;

        which = Math.floor(which);

        if (which == 0) {;

            bomb = true;

        };

        which = which / 1;

        current = eval("obj" + which);

        return;

    };


    function move(way) {;

        if (paused) return;

        if (dontgo) return;

        dontgo = true;

        for (var one = 0; one < 4; one++) {;

            hold[one] = y + way + current[rindex][one];

        };

        canmove(hold, way);

        if (movebad) {;

            movebad = false;

            if (way == 1 || way == -1) {;

                dontgo = false;

                return;

            };

            if (bomb) {;

                bomblines(hold);

                getnew = true;

                return;

            };

            filledline(hold);

            getnew = true;

            return;

        };

        for (var one = 0; one < 4; one++) {;

            t = y + current[rindex][one];

            $("img#" + (t + 1)).attr("src", whtblck.src);

        };

        y += way;

        for (var one = 0; one < 4; one++) {;

            t = y + current[rindex][one];

            $("img#" + (t + 1)).attr("src", current[4].src);

        };

        dontgo = false;

    };


    function rotate() {;

        if (paused) return;

        if (dontgo) return;

        for (var one = 0; one < 4; one++) {;

            var rr = rindex - 1;

            if (rr == -1) rr = 3;

            t = y + current[rr][one];

            var tt = y + current[rindex][one];

            hold[one] = t;

            t = t - (Math.floor(t * .1)) * 10;

            tt = tt - (Math.floor(tt * .1)) * 10;

            if ((Math.min(t, tt) == 0 || Math.min(t, tt) == 1) && (Math.max(t, tt) == 9 || Math.max(t, tt) == 8)) movebad = true;

        };

        canmove(hold, 0);

        if (movebad) {;

            movebad = false;

            return;

        };

        for (var one = 0; one < 4; one++) {;

            t = y + current[rindex][one];

            $("img#" + (t + 1)).attr("src", whtblck.src);

        };

        rindex -= 1;

        if (rindex == -1) rindex = 3;

        for (var one = 0; one < 4; one++) {;

            t = y + current[rindex][one];

            $("img#" + (t + 1)).attr("src", current[4].src);

        };

    };


    function canmove(hold, way) {;

        for (var one = 0; one < 4; one++) {;

            t = hold[one];

            if (blckfilled[t] == 1) movebad = true;

        };

        if (way == -1) {;

            for (var one = 0; one < 4; one++) {;

                t = hold[one];

                t = t - (Math.floor(t * .1)) * 10;

                if (t == 9) movebad = true;

            };

        };

        if (way == 1) {;

            for (var one = 0; one < 4; one++) {;

                t = hold[one];

                t = t - (Math.floor(t * .1)) * 10;

                if (t == 0) movebad = true;

            };

        };

    };


    function filledline(hold) {;

        for (var one = 0; one < 4; one++) {;

            t = hold[one] - 10;

            blckfilled[t] = 1;

            var integer = Math.floor((t * .1));

            lines[integer] += blckfilled[t];

        };

        x = 0;

        for (var one = 3; one < 23; one++) {;

            if (lines[one] == 10) x += 1;

        };

        for (var three = 0; three <= x; three++) {;

            removeline();

        };

        viewModel.score(ptb + parseInt(viewModel.score()));

        if (x == 4) {;

            viewModel.score(1000 + parseInt(viewModel.score()));

        };

        return;

    };


    function bomblines(hold) {;

        for (var one = 0; one < 4; one++) {;

            t = hold[one] - 10;

            var integer = Math.floor((t * .1));

            lines[integer] = 10;

        };

        x = 0;

        for (var one = 3; one < 23; one++) {;

            if (lines[one] == 10) x += 1;

        };

        for (var hh = 0; hh <= x; hh++) {;

            removeline();

        };

        viewModel.score(ptb + parseInt(viewModel.score()));

        return;

    };


    function removeline() {;

        for (var one = 2; one < 22; one++) {;

            if (lines[one] == 10) {;

                var change = (one * 10) + 9;

                if (bomb) {

                    for (two = change; two > (change - 10); two--) {;

                        $("img#" + (two + 1)).attr("src", explode.src);

                    };
                };

                for (var two = change; two > 9; two--) {;

                    var twom = two - 10;

                    $("img#" + (two + 1)).attr("src", $("img#" + (twom + 1)).attr("src"));

                    blckfilled[two] = blckfilled[twom];

                };

                if (!bomb) {;

                    viewModel.score(ptl + parseInt(viewModel.score()));

                };

                lns += 1;
                viewModel.lines(lns);

                spd -= acl;

                for (var two = one; two > 3; two--) {;

                    var twom = two - 1;

                    lines[two] = lines[twom];

                };

                return;

            };

        };

        return;

    };


    function nextlevel() {;

        for (var one = 219; one > -1; one--) {;

            if ($("img#" + (one + 1)).attr("src") == whtblck.src) {;

                $("img#" + (one + 1)).attr("src", explode.src);

            };

            viewModel.score(ptb + parseInt(viewModel.score()));

        };

        nonew = false;

        blv += 1;
        if (blv == lna) {;

            gameover = true;

            finished();

            return;

        };

        viewModel.blevel(blv);

        startme();

        return;

    };

    function writelevel() {;
        var pixels = "";
        if (blv >= lna) finished();
        var lv = eval("lvi" + blv);
        for (var one = 1; one < 25; one++) {;
            lines[one] = 0;
        };
        for (var one = 0; one < 20; one++) {;
            t = lv.charAt(one);
            pixels = "" + pixels + eval("pxi" + t);
        };
        var z = 0;
        for (var one = 0; one < 20; one++) {
            $("img#" + (z + 1)).attr("src", whtblck.src);
            blckfilled[z] = 0;
            z += 1;
        };
        for (var one = 0; one < 200; one++) {;
            if (pixels.charAt(one) == '0') {;
                $("img#" + (z + 1)).attr("src", whtblck.src);
                blckfilled[z] = 0;
                z += 1;
            } else {;
                $("img#" + (z + 1)).attr("src", endblck.src);
                blckfilled[z] = 1;
                z += 1;
            };
        };
        for (var one = 0; one < 10; one++) {;
            blckfilled[z] = 1;
            z += 1;
        };
        for (var one = 3; one < 25; one++) {;
            for (var two = 0; two < 10; two++) {;
                var tw = parseInt("" + one + two);
                lines[one] += blckfilled[tw];
            };
        };
        return;
    };

    function getlevel() {;
        if (viewModel.level() == 0) {;
            spd = 600;
            acl = 5;
            ptl = 75;
            ptb = 5;
        };
        if (viewModel.level() == 1) {;
            spd = 500;
            acl = 5;
            ptl = 100;
            ptb = 5;
        };
        if (viewModel.level() == 2) {;
            spd = 400;
            acl = 5;
            ptl = 150;
            ptb = 10;
        };
        if (viewModel.level() == 3) {;
            spd = 300;
            acl = 3;
            ptl = 200;
            ptb = 10;
        };
        if (viewModel.level() == 4) {;
            spd = 266;
            acl = 3;
            ptl = 300;
            ptb = 20;
        };
        if (viewModel.level() == 5) {;
            spd = 233;
            acl = 3;
            ptl = 500;
            ptb = 20;
        };
    };

    var lvi1 = "0000000000000111223b";
    var lvi2 = "11111111111111111111";
    var lvi3 = "0000000000000bb22222";
    var lvi4 = "00000000000888000000";
    var lvi5 = "22222222222222222222";
    var lvi6 = "0000000000766554123b";
    var lvi7 = "00000000880000990000";
    var lvi8 = "33333333333333333333";
    var lvi10 = "0000000a5555a7add766";
    var lvi9 = "00000000007654b44ccc";
    var lvi11 = "0000000000eeeeeeeeee";
    var lvi12 = "0000000000efefefefef";
    var lvi14 = "30303030303030303030";
    var lvi13 = "00300003000300303030";
    var lna = 14 + 1;
    var pxi0 = "0000000000";
    var pxi1 = "1000000001";
    var pxi2 = "1100000011";
    var pxi3 = "1110000111";
    var pxi4 = "0100000010";
    var pxi5 = "0010000100";
    var pxi6 = "0001001000";
    var pxi7 = "0000110000";
    var pxi8 = "1111111000";
    var pxi9 = "0001111111";
    var pxia = "0001111000";
    var pxib = "1111001111";
    var pxic = "0100110010";
    var pxid = "0010110100";
    var pxie = "0101010101";
    var pxif = "1010101010";

    var describe = function(which) {;
        viewModel.info(which);
        $("#toastContainer").dxToast('instance').show();
    };

    var about = "" + viewModel.title() + ". Tell your friends!";
    var help = "Finish twenty lines and you progress to a new level. Try rotating bombs to different shapes. Press Start to start. Press Pause to pause.";

    return viewModel;
};