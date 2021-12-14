
import torch


def _create(name, pretrained=True, channels=3, classes=80, autoshape=True, verbose=True, device=None):
    """
    Arguments:
        name (str): name of model
        pretrained (bool): load pretrained weights into the model
        channels (int): number of input channels
        classes (int): number of model classes
        autoshape (bool): apply  .autoshape() wrapper to model
        verbose (bool): print all information to screen
        device (str, torch.device, None): device to use for model parameters

    Returns:
        pytorch model
    """
    from pathlib import Path

    from models.yolo import Model
    from models.experimental import attempt_load


    file = Path(__file__).resolve()
 

    save_dir = Path('') if str(name).endswith('.pt') else file.parent
    path = (save_dir / name).with_suffix('.pt')  # checkpoint path
    try:
        

        if pretrained and channels == 3 and classes == 80:
            model = attempt_load(path, map_location=device)  # download/load FP32 model
        else:
            cfg = list((Path(__file__).parent / 'models').rglob(f'{name}.yaml'))[0]  # model.yaml path
            model = Model(cfg, channels, classes)  # create model
            if pretrained:
                ckpt = torch.load(path, map_location=device)  # load
                msd = model.state_dict()  # model state_dict
                csd = ckpt['model'].float().state_dict()  # checkpoint state_dict as FP32
                csd = {k: v for k, v in csd.items() if msd[k].shape == v.shape}  # filter
                model.load_state_dict(csd, strict=False)  # load
                if len(ckpt['model'].names) == classes:
                    model.names = ckpt['model'].names  # set class names attribute
        if autoshape:
            model = model.autoshape()  # for file/URI/PIL/cv2/np inputs and NMS
        return model.to(device)

    except Exception as e:
        s = "Cache may be out of date"
        raise Exception(s) from e


def custom(path='', autoshape=True, verbose=True, device='cpu'):
    # local model
    return _create(path, autoshape=autoshape, verbose=verbose, device=device)


if __name__ == '__main__':
    import cv2
    import numpy as np
    from PIL import Image
    from pathlib import Path

    
