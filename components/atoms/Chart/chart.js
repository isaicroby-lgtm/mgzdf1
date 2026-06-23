import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const ChartjsBarChartTransparent = ({ labels, datasets, options }) => {
  return <Bar options={options} data={{ datasets, labels }} />;
};

export default ChartjsBarChartTransparent;
