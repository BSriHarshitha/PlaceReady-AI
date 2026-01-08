import React from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import { Share } from '@mui/icons-material';

interface SocialShareProps {
  score: number;
  url?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ score, url = window.location.href }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shareText = `I scored ${score}% on my placement readiness analysis! 🎯 Check out PlaceReady AI to analyze your skills.`;

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Share />}
        onClick={handleClick}
        aria-label="share results"
      >
        Share Results
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <FacebookShareButton url={url} hashtag="#PlaceReadyAI" style={{ display: 'flex', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <FacebookIcon size={32} round />
              <span>Facebook</span>
            </Box>
          </FacebookShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TwitterShareButton url={url} title={shareText} style={{ display: 'flex', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <TwitterIcon size={32} round />
              <span>Twitter</span>
            </Box>
          </TwitterShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LinkedinShareButton url={url} title={shareText} style={{ display: 'flex', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <LinkedinIcon size={32} round />
              <span>LinkedIn</span>
            </Box>
          </LinkedinShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <WhatsappShareButton url={url} title={shareText} style={{ display: 'flex', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <WhatsappIcon size={32} round />
              <span>WhatsApp</span>
            </Box>
          </WhatsappShareButton>
        </MenuItem>
      </Menu>
    </Box>
  );
};

