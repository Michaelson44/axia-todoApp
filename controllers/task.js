const taskModel = require('../model/task');

const makeTask = async (req, res) => {
    const {title, desc, category, deadline} = req.body;
    const {id} = req.user;

    if (!title, !desc, !category, !deadline) {
        return res.status(401)
                    .json({success: false, message: "unexpected field"});
    }

    const task = new taskModel({creatorId: id, title,
                                desc, category, deadline
    });
    try {
        const savedTask = await task.save();
        res.status(200).json(savedTask);
    } catch (err) {
        res.status(401).json({success: false, error: err.message});
    }
};

const getTasks = async (req, res) => {
    // const {category} = req.query;
    // let filter = {};
    // if (category) {
    //     filter = {category: category}
    // }


    // query validation
    let filter = {}
    if (req.query.category) {
        // filter = {category: req.query.category};
        filter.category = req.query.category;
    }

    if (req.query.deadline) {
        filter.deadline = req.query.deadline;
    }

    try {
        const allTask = await taskModel.find(filter);
        res.status(200)
            .json(allTask);
    } catch (err) {
        res.status(401)
            .json({success: false, error: err.message});
    }
};

const singleTask = async (req, res) => {
    const {id} = req.params;
    try {
        const task = await taskModel.findById(id);
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const deleteTask = async (req, res) => {
    const {id} = req.query;
    const userId = req.user.id;
    try {
        // validate task
        const task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({success: false, error: "task not found"});
        }
        // validate user
        if (task.creatorId !== userId) {
            return res.status(321).json({success: false, error: "you are not authorized for that"})
        }
        await taskModel.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "task has been deleted"});
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const updateTask = async (req, res) => {
    // normally we would get the things we dont want them to update
    // but this is a todo list they can update things
    const {id, ...others} = req.body;
    const userId = req.user.id;
    try {
        // validate task
        const task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({success: false, error: "task not found"});
        }
        // validate user
        if (task.creatorId !== userId) {
            return res.status(321).json({success: false, error: "you are not authorized for that"})
        }
        await taskModel.findByIdAndUpdate(id, {...others}, {new: true});
        res.status(201).json({success: true, message: "post has been updated"});
    } catch(err) {
        res.status(500).json(err.message);
    }
};

const completedTask = async (req, res) => {
    const {taskId} = req.params;
    const userId = req.user.id;
    try {
        const task = await taskModel.findById(taskId);
        // validate task 
        if (!task) {
            return res.status(404).json({success: false, error: "task not found"});
        }
        // validate user
        if (task.creatorId !== userId) {
            return res.status(321).json({success: false, error: "you are not authorized for that"})
        }

        await taskModel.findByIdAndUpdate(taskId, {completed: true}, {new: true});
        res.status(200).json({success: true, message: "task has been completed"});
    } catch(err) {
        res.status(500).json(err.message);
    }
};

const getDeadline = async (req, res) => {
    // const deadline = await taskModel.deadline;
    const {taskId} = req.query;
    try {
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({success: false, error: "task not found"});
        }

        const deadline = new Date(task.deadline);
        const now = new Date();
        const timeRemaining = deadline - now;

        if (timeRemaining < 0) {
            return res.status(301).json({success: false, message: "Deadline has passed"});
        }
        
        res.json({success: true, message: `due-date: ${deadline}`});
    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }

};

const getAllDeadlines = async (req, res) => {
    try {
        const tasks = await taskModel.find();
        
        const deadlines = tasks.map(task => task.deadline);
        res.status(200).json({success: true, deadlines});
    } catch (err) {
        res.status(500).json({success: false, error: err.message})
    }
}

module.exports = {makeTask, getTasks, singleTask, deleteTask, updateTask, completedTask, getDeadline, getAllDeadlines};