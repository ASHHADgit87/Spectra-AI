import React from 'react'
import type { Project } from '../types'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({gen,setGenerations,forCommunity = false} : {gen:Project,setGenerations:React.Dispatch<React.SetStateAction<Project[]>>,forCommunity?:boolean}) => {
    const navigate = useNavigate();
  return (
    <div>ProjectCard</div>
  )
}

export default ProjectCard