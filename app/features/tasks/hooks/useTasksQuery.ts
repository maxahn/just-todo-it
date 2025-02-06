import { useQuery } from '@tanstack/react-query'
import { Task } from '../types'

const useTasksQuery = () => useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
        const response = await fetch(`https://api.todoist.com/rest/v2/tasks`, {
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_TODOIST_API_KEY}`
            }
        }) 
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json() as Promise<Task[]>
    }
})

export default useTasksQuery