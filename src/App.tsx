import React from "react";
import "./App.css";
import { Col, Row } from "antd";

import VerticalList from "./VerticalList";
import HorizontalList from "./HorizontalList";
import MultiDrag from "./MultiDrag";

const App: React.FC = () => (
  <main className="p-8">
    <Row className="p-3 bg-slate-100 mb-5">
      <Col span={9} className="p-4 bg-[#daa359] rounded">
        <VerticalList />
      </Col>
      <Col span={14} offset={1} className="p-3 bg-[#daa359] rounded">
        <HorizontalList />
      </Col>
    </Row>
    <Row className="p-3 bg-slate-100">
      <Col span={24} className="p-5 bg-[#daa359] rounded">
        <MultiDrag />
      </Col>
    </Row>
  </main>
);

export default App;
