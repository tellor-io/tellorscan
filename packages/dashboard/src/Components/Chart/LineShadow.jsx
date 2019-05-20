
import React from "react";
import ChartComponent, { Chart } from "react-chartjs-2";
import * as align from 'Constants/alignments';
import cn from 'classnames';

export default class LineShadow extends React.Component {
  componentWillMount() {

    Chart.defaults.lineWithShadow = Chart.defaults.line;
    Chart.defaults.height = 100;
    Chart.plugins.register({
      afterDraw: (chart) => {
        let msg = "No data in time range";
        if (chart.data.datasets.length === 0) {
          var ctx = chart.chart.ctx;
          var width = chart.chart.width;
          var height = chart.chart.height
          chart.clear();

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = "16px normal 'Helvetica Nueue'";
          ctx.fillText(msg, width / 2, (height / 2)+30);
          ctx.restore();
        }
      }
    });

    Chart.controllers.lineWithShadow = Chart.controllers.line.extend({
      draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);
        var ctx = this.chart.ctx;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        ctx.responsive = true;
        ctx.stroke();
        Chart.controllers.line.prototype.draw.apply(this, arguments);
        ctx.restore();
      }
    });
  }

  render() {

    return (
      <ChartComponent
        height={100}
        className={cn("chart-component", align.full, align.noMarginPad)}
        ref={ref => (this.chart_instance = ref && ref.chart_instance)}
        type="lineWithShadow"
        {...this.props}
      />
    );
  }
}
