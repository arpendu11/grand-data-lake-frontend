import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
// import gql from 'graphql-tag';
import Title from './Title';
// import TidyTreeChart from './TidyTreeChart';
// import TangledTreeChart from './TangledTreeChart';
// import SimpleD3Tree from './SimpleD3Tree';
// import DendogramTreeChart from './DendogramTreeChart';
import GoOrgChart from './GoOrgChart';
import testData from '../testData.json';

// const GET_SELECTED_USER_QUERY = gql`
// {
//   User {
//     key:id
//     name:firstName
//     title:employeeTitle
//     photo
//     parent {
//       id
//     }
//   }
// }
// `;
const GET_SELECTED_USER_QUERY = testData;

export default function OrganizationHierarchy() {
  // const { loading, error, data } = useQuery(GET_SELECTED_USER_QUERY);
  const { loading, error, data } = GET_SELECTED_USER_QUERY;
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
  }, []);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Title>Organizational Hierarchy</Title>
      {/* <TangledTreeChart data={data['User'][82]} /> */}
      {/* <TidyTreeChart data={data['User'][82]} /> */}
      {/* <SimpleD3Tree data={data['User'][82]} /> */}
      {/* <DendogramTreeChart data={data['User'][82]} /> */}
      <GoOrgChart data={data['User']} />
    </React.Fragment>
  );
}
