var vars = [];
var vals = [];
var visitors,
    conversions,
    convRate,
    standardError,
    controlConvRate,
    variationConvRate,
    controlStandardError,
    variationStandardError,
    zscore,
    pvalue,
    confidence,
    difference,
    improvement;

$('#submit').on('click', function(){
  var vis01 = parseInt($('#vis01').val()),
      vis02 = parseInt($('#vis02').val()),
      con01 = parseInt($('#con01').val()),
      con02 = parseInt($('#con02').val());

  vars = [];
  vars.push([vis01, con01],[vis02, con02]);
  getSignificance();
});

function getSignificance() {
  vals = [];
  // Create visitors, conversions, conversion rate, and standard deviation variables for two variations
  $.each(vars, function(i, val){
    visitors = val[0];
    conversions = val[1];
    convRate = conversions/visitors;
    standardError = Math.sqrt(convRate*(1-convRate)/visitors);

    // Add variables to global array
    vals.push([visitors, conversions, convRate, standardError]);
  });
  console.log(vals);

  controlConvRate = vals[0][2],
  variationConvRate = vals[1][2],
  controlStandardError = vals[0][3],
  variationStandardError = vals[1][3];
  if(controlConvRate > variationConvRate) {
    difference = ((variationConvRate-controlConvRate)/variationConvRate)*100;
  }else{
    difference = ((controlConvRate-variationConvRate)/controlConvRate)*100;
  }
  improvement = ((difference).toFixed(1)).substring(1) + "%",
  zscore = (controlConvRate - variationConvRate)/(Math.sqrt(Math.pow(controlStandardError,2)+Math.pow(variationStandardError,2))),
  pvalue = jStat.normal.cdf(zscore, 0, 1),
  confidence = (pvalue*100).toFixed(1) + "%";

  if(controlConvRate > variationConvRate) {
    $('#winner').html('variation 1');
  }else if(controlConvRate < variationConvRate) {
    $('#winner').html('variation 2');
    confidence = ((1-pvalue)*100).toFixed(1) + "%";
  }else{
    $('#winner').html('neither');
    confidence = "pretty darn";
  }

  $('#confidence').html(confidence);
  $('#improvement').html(improvement);
  $('#results').fadeIn();
}
