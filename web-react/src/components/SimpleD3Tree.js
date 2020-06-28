import React, { useRef } from 'react';
import Tree from 'react-d3-tree';

const SimpleD3Tree = ({ data }) => {
    const wrapperRef = useRef();

    return (
        <div ref={wrapperRef} style={{ width: 'auto', height: 'auto' }}>
            <Tree data={data.parent[0]} />
        </div>
    );
};

export default SimpleD3Tree;