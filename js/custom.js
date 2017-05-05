$(document).ready(function() {

var pieChart = null;
var lineChart = null;
var gaugeChart = null;

function checkKlocInput() {
	var kloc = $("#klocInput").val();
	var error = false;

	if (kloc) {
		if (kloc > 0 && kloc <= 1000000) {
			$("#klocInputForm").removeClass("has-error");
			$("#klocInputMsg").empty();
		} else {
			$("#klocInputForm").addClass("has-error");
			$("#klocInputMsg").empty();
			$("#klocInputMsg").append("Should be between 0 and 1000000");
			error = true;
		}
	} else {
		$("#klocInputForm").addClass("has-error");
		$("#klocInputMsg").empty();
		$("#klocInputMsg").append("Should not be empty");
		error = true;
	}

	if (error) {
		$('html, body').animate({
		        scrollTop: $("#one").offset().top - 50
		    }, 1000);
	}

	return error;
};

$("#klocInput").change(function() {
	checkKlocInput();
});

$("#toTwo").click(function() {
	if (!checkKlocInput()) {
		$('html, body').animate({
	        scrollTop: $("#two").offset().top - 50
	    }, 1000);
	}
});

$("#toThree").click(function() {
	if (!checkKlocInput()) {
	    $('html, body').animate({
	        scrollTop: $("#three").offset().top - 50
	    }, 1000);
	}
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
    if (!checkKlocInput()) {
    	var kloc = $("#klocInput").val();
    	var allCoefs = {
	        0: { a: 2.4, b: 1.05, c: 2.5, d: 0.38, ai: 3.2, bi: 1.05 },
	        1: { a: 3.0, b: 1.12, c: 2.5, d: 0.35, ai: 3.0, bi: 1.12 },
	        2: { a: 3.6, b: 1.20, c: 2.5, d: 0.32, ai: 2.8, bi: 1.20 }
	    };
	    var ratingNames = ["NA", "Very Low", "Low", "Normal", "High", "Very High", "Extra High"];
	    var mode = $("#modeSelect").val();
	    var coef = allCoefs[mode];
	    var effort;
	    var title;

	    if ($("#turnOn").is(":checked")) { // intermediate
	    	var eaf = 1;
	    	var drivers = $(".driversSelect");
	    	var ratings = {};
	    	drivers.each((i, el) => {
	    		eaf *= $(el).val();
	    		ratings[i] = ratingNames.indexOf($(el).find('option:selected').text());
	    	});
	    	effort = coef.ai * Math.pow(kloc, coef.bi) * eaf;
	    	title = "Intermediate";
	    	$("#level").empty();
	    	$("#level").append("Intermediate");

	    	pieChart = c3.generate({
	    					bindto: "#pieChart",
	    					size: {
	    						height: 400,
							  	width: 960
							},
						    data: {
						        columns: [
						            ['Required reliability', ratings[0]],
						            ['Database size', ratings[1]],
						            ['Product complexity', ratings[2]],
						            ['Execution time constraint', ratings[3]],
						            ['Main Storage constraint', ratings[4]],
						            ['Virtual machine volatility', ratings[5]],
						            ['Computer turnaround time', ratings[6]],
						            ['Analyst capability', ratings[7]],
						            ['Applications experience', ratings[8]],
						            ['Programmer capability', ratings[9]],
						            ['Virtual machine experience', ratings[10]],
						            ['Programming language experience', ratings[11]],
						            ['Modern Programming Practices', ratings[12]],
						            ['Use of software tools', ratings[13]],
						            ['Required development schedule', ratings[14]]
						        ],
						        type : 'pie'
						    },
						    tooltip: {
								format: {
						            value: function (value, ratio, id) {
						                return ratingNames[value];
						            }
								}
							},
							pie: {
								label: {
									threshold: 0.01
								}
							}
			});
	    } else { // basic
	    	effort = coef.a * Math.pow(kloc, coef.b);
	    	title = "Basic";
	    	pieChart = c3.generate({
	    					bindto: "#pieChart",
	    					size: {
	    						height: 400,
							  	width: 960
							},
						    data: {
						        columns: [
						            ['Required reliability', 1],
						            ['Database size', 2],
						            ['Product complexity', 1],
						            ['Execution time constraint', 3],
						            ['Main Storage constraint', 3],
						            ['Virtual machine volatility', 2],
						            ['Computer turnaround time', 2],
						            ['Analyst capability', 1],
						            ['Applications experience', 1],
						            ['Programmer capability', 1],
						            ['Virtual machine experience', 1],
						            ['Programming language experience', 1],
						            ['Modern Programming Practices', 1],
						            ['Use of software tools', 1],
						            ['Required development schedule', 1]
						        ],
						        type : 'pie'
						    },
						    tooltip: {
								format: {
						            value: function (value, ratio, id) {
						                return ratingNames[value];
						            }
								}
							},
							pie: {
								label: {
									threshold: 0.01
								}
							}
			});
	    }

	    var duration = coef.c * Math.pow(effort, coef.d);
	    var staff = effort / duration;

	    lineChart = c3.generate({
	    					bindto: "#lineChart",
	    					size: {
	    						height: 400,
							  	width: 960
							},
						    data: {
							    x: 'x',
						        columns: [
						            ['x', (staff / 2).toFixed(2), staff.toFixed(2), (staff * 2).toFixed(2)],
						            ['Duration (in month)', (duration * 1.75).toFixed(2), duration.toFixed(2), (duration * 0.7).toFixed(2)]
						        ]
							},
						    tooltip: {
								format: {
									title: function (d) { return 'Staff size: ' + d; }
								}
							},
						    axis: {
							    x: {
						            label: 'People',
						            tick: {
						            	count: 10,
						            	format: function (x) { return x.toFixed(2); }
						            }
						        },
						        y: {
						            label: 'Month'
						        }
							}
		});

		var percentKloc = kloc / 10000 < 0.5 ? 0.5 : kloc / 10000;

		gaugeChart = c3.generate({
							bindto: "#gaugeChart",
							size: {
								height: 250,
							  	width: 450
							},
						    data: {
						        columns: [
						            ['KLOC', percentKloc]
						        ],
						        type: 'gauge'
						    },
		    				gauge: {
								   width: 39
						    },
						    tooltip: {
								format: {
									value: function (value, ratio, id) {
						                return kloc;
						            }
								}
							},
							color: {
							    pattern: ['#673ab7', '#4527a0', '#283593', '#1e88e5', '#43a047', '#9ccc65', '#ffeb3b', '#ffc107', '#ff9800', '#d84315'],
							    threshold: {
							        values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
							    }
							}
		});

	    $("#level").empty();
	    $("#level").append(title);
		$("#calculation").hide();
		$("#duration").empty();
		$("#staff").empty();
		$("#duration").append(duration.toFixed(2));
		$("#staff").append(staff.toFixed(2));

	    $("#result").show();
	}
});

$("#back").click(function() {
	$("#result").hide();
    $("#calculation").show();
});

});