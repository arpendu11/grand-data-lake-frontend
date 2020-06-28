import React, { useRef, useEffect } from 'react';
import { select, tree, hierarchy, linkHorizontal, zoom, event } from 'd3';
import '../scss/styles.scss';


const TidyTreeChart = ({ data }) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef();
    useEffect(() => {
        const svg = select(svgRef.current);
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        // const width = document.body.clientWidth;
        // const height = document.body.clientHeight;
        const margin = { top: 0, right: 50, bottom: 0, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const treeLayout = tree().size([innerHeight, innerWidth]);
        const root = hierarchy(data.parent[0]);
        const links = treeLayout(root).links();
        const linkPathGenerator = linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);
        console.log(width);
        console.log(height);

        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        // [0, 0, width, x1 - x0 + root.dx * 2]

        const zoomG = svg
            .attr('width', 954)
            .attr('height', height)
            // .attr('viewBox', '0 0 48 48')
            .append('g');

        const g = zoomG.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        svg.call(zoom(), () => {
            zoomG.attr('transform', event.transform)
        });

        console.log(root.descendants())

        g.selectAll('path').data(links)
            .enter().append('path')
            .attr('d', linkPathGenerator);

        g.selectAll('text').data(root.descendants())
            .enter().append('text')
            .attr('x', d => d.y)
            .attr('y', d => d.x)
            .attr('dy', '0.32em')
            .attr('text-anchor', d => d.children ? 'middle' : 'start')
            .attr('font-size', d => 2 - d.depth + 'em')
            .text(d => d.data.firstName + ' ' + d.data.lastName);

    }, [data]);


    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef} className='tree'></svg>
        </div>
    );
};

export default TidyTreeChart;