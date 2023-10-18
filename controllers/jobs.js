const Job = require('../models/Job')
const statusCodes = require('http-status-codes')


const getAllJobs = async (req, res) => {
    const id = req.user.userId
    const job = await Job.find({ createdBy: id }).sort('createdAt')
    res.status(statusCodes.StatusCodes.OK).json({ job, count: job.length })
}

const getJob = async (req, res) => {
    const { id: JobId } = req.params
    const { userId } = req.user
    const job = await Job.findOne({
        _id: JobId, createdBy: userId
    })
    if (!job) {
        return res.status(statusCodes.StatusCodes.NOT_FOUND).json('Not Found any Job')
    }
    res.status(statusCodes.StatusCodes.OK).json(job)
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)

    res.status(statusCodes.StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) => {
    const { id: JobId } = req.params
    const { userId } = req.user
    const { company, position } = req.body

    if (company === '' || position === '') {
        return res.status(statusCodes.StatusCodes.NOT_FOUND).json('Not Found any object to update')
    }

    const job = await Job.findOneAndUpdate(
        {
            _id: JobId, createdBy: userId
        },
        req.body,
        {
            new: true,
            runValidators: true
        }
    )
    if (!job) {
        return res.status(statusCodes.StatusCodes.NOT_FOUND).json('Not Found any Job')
    }
    res.status(statusCodes.StatusCodes.OK).json(job)
}
const deleteJob = async (req, res) => {
    const {id:jobId} = req.params
    const {userId} = req.user

    const job = await Job.findOneAndDelete({
        _id:jobId, createdBy:userId
    })

    if (!job) {
        return res.status(statusCodes.StatusCodes.NOT_FOUND).json('Not Found any Job')
    }

    res.status(statusCodes.StatusCodes.OK).json('Deleted Job')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}