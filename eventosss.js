exports.mostrarevento = async (req, res) => {
    try {
      const evento = await evento.findById(req.params.id);
      if(!evento){
        return next(new ErrorApp('No se pudo ', 404))
    }
      res.status(200).json({
        status: 'success',
        data: {
          evento
        }
      });

    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };