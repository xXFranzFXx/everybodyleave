exports.healthCheck = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Server healthy'})
    } catch (err) {
        return res.status(401).json({ error: err });
    }
}   