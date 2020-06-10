import React from 'react'

interface ShapeProps {
  opacity?: number
  rotate?: number | string
}

interface RectangleProps extends ShapeProps {
  height?: number
  width?: number
  radius?: number | string
}

interface SquareProps extends ShapeProps {
  size?: number
  radius?: number | string
}

interface CircleProps {
  size?: number,
  opacity?: number
}

interface TriangleProps extends ShapeProps {
  size?: number
}

interface PillProps extends ShapeProps {
  height?: number
  width?: number
}

export const Square: React.FC<SquareProps> = ({ size, ...props }) => {
  return <Rectangle height={size} width={size} {...props} />
}

export const Rectangle: React.FC<RectangleProps> = ({ height, width, opacity, radius, rotate }) => {

  const style: React.CSSProperties = {
      cursor: 'pointer',
      height,
      width,
      backgroundColor: '#fff',
      opacity,
      borderRadius: radius,
      transform: 'rotate(' + rotate + 'deg)'
  }

  return <div style={style} />
}

export const Circle: React.FC<CircleProps> = props => {
  const radius = props.size ? props.size / 2 : 0;
  return <Square {...props} radius={radius} />
}

export const Pill: React.FC<PillProps> = props => {
  const { width, height } = props;
  const radius = (width && height) ? (width < height ? width / 2 : height / 2) : 0;
  return <Rectangle {...props} radius={radius} />
}

export const Triangle: React.FC<TriangleProps> = ({ size, opacity, rotate }) => {

  const height = 2 * (size || 0) * 0.866;

  const style: React.CSSProperties = {
      cursor: 'pointer',
      width: 0,
      height: 0,
      borderRight: (size + 'px solid transparent'),
      borderLeft: (size + 'px solid transparent'),
      borderBottom: (height + 'px solid rgba(255, 255, 255, ' + (opacity || 1) + ')'),
      transform: 'rotate(' + rotate + 'deg)'
  }

  return <div style={style} />
}
