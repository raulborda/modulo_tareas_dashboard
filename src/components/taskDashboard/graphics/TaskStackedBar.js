import { Card, Empty } from "antd";
import React from "react";
import {
  Legend,
  Tooltip,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,
} from "recharts";

const TaskStackedBar = ({ data }) => {
  data.sort((a, b) => {
    return b.totalPorBarra - a.totalPorBarra;
  });

  return (
    <Card
      title="TAREAS ABIERTAS POR TIPO"
      size="small"
      style={{ padding: "5px" }}
    >
      <>
        {data && data.length > 0 ? (
          <div>
            <ComposedChart
              barCategoryGap={"20%"}
              layout="vertical"
              width={800}
              height={580}
              data={data}
              margin={{
                top: 20,
                right: 50,
                bottom: 20,
                left: 45,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />

              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="vencidas" fill={"#f23"} stackId={1} />
              <Bar dataKey="vigentes" fill={"#01b23b"} stackId={1}>
                <LabelList dataKey="totalPorBarra" position="right" />
              </Bar>
            </ComposedChart>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    </Card>
  );
};

export default TaskStackedBar;
