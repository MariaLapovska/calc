$("#slocInput").change(function() {
	var sloc = $("#slocInput").val();
	if (sloc) {
		if (sloc > 0 && sloc <= 1000000000) {
			$("#slocInputForm").removeClass("has-error");
			$("#slocInputMsg").empty();
		} else {
			$("#slocInputForm").addClass("has-error");
			$("#slocInputMsg").empty();
			$("#slocInputMsg").append("Should be between 0 and 1000000000");
		}
	} else {
		$("#slocInputForm").addClass("has-error");
		$("#slocInputMsg").empty();
		$("#slocInputMsg").append("Should not be empty");
	}
});

$("#toTwo").click(function() {
	var sloc = $("#slocInput").val();
	if (sloc) {
		if (sloc > 0 && sloc <= 1000000000) {
			$('html, body').animate({
		        scrollTop: $("#two").offset().top - 50
		    }, 1000);
		}
	} else {
		$("#slocInputForm").addClass("has-error");
		$("#slocInputMsg").empty();
		$("#slocInputMsg").append("Should not be empty");
	}
});

$("#toThree").click(function() {
    $('html, body').animate({
        scrollTop: $("#three").offset().top - 50
    }, 1000);
});

$("#turnOn").click(function() {
	if ($("#turnOn").is(":checked")) {
		$("#accordion").show(800);
	} else {
		$("#accordion").hide(800);
	}
});

$(".collapsible").click(function(event) {
	var el = $(event.target);
	var collapsed = $("#accordion").find(".in");
	
	collapsed.each(function() {
		var current = $(this).prev().find("a");
		if (current.attr("id") != el.attr("id")) {
			var a = current.prev()
			a.removeClass("fa-caret-down");
			a.addClass("fa-caret-right");
		}
	});

	el = el.prev();

	if (el.hasClass("fa-caret-right")) {
		el.removeClass("fa-caret-right");
		el.addClass("fa-caret-down");
	} else {
		el.removeClass("fa-caret-down");
		el.addClass("fa-caret-right");
	}
});

$("#calculate").click(function() {
    if (!$("#slocInputForm").hasClass("has-error")) {
    	var sloc = $("#slocInput").val() / 1000;
    	var allCoefs = {
	        0: { a: 2.4, b: 1.05, c: 2.5, d: 0.38, ai: 3.2, bi: 1.05 },
	        1: { a: 3.0, b: 1.12, c: 2.5, d: 0.35, ai: 3.0, bi: 1.12 },
	        2: { a: 3.6, b: 1.20, c: 2.5, d: 0.32, ai: 2.8, bi: 1.20 }
	    };
	    var mode = $("#modeSelect").val();
	    var coef = allCoefs[mode];
	    var effort;
	    if ($("#turnOn").is(":checked")) { // intermediate
	    	var eaf = 1;
	    	var drivers = $(".driversSelect");
	    	drivers.each(function() {
	    		eaf *= $(this).val();
	    	});

	    	effort = coef.ai * Math.pow(sloc, coef.bi) * eaf;
	    	$("#level").empty();
	    	$("#level").append("Intermediate");
	    } else { // basic
	    	effort = coef.a * Math.pow(sloc, coef.b);
	    	$("#level").empty();
	    	$("#level").append("Basic");
	    }

	    var duration = coef.c * Math.pow(effort, coef.d);
	    var staff = effort / duration;

		$("#calculation").hide();
		$("#duration").empty();
		$("#staff").empty();
		$("#duration").append(duration.toFixed(2));
		$("#staff").append(staff.toFixed(2));
	    $("#result").show();
	} else {
		$('html, body').animate({
        	scrollTop: $("#one").offset().top - 50
    	}, 1000);
	}
});

$("#back").click(function() {
	$("#result").hide();
    $("#calculation").show();
});