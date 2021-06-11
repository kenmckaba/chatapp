import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Rooms, { ROOMS } from "./Rooms";

Enzyme.configure({ adapter: new Adapter() });

it("renders ROOMS.length rooms", () => {
  const wrapper = shallow(<Rooms />);
  expect(wrapper.children().length).toEqual(2);
});
