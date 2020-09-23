import React from 'react';
import Icon from '@ant-design/icons';
import {
  TwitterOutlined,
  LinkedinFilled,
  YoutubeFilled,
  GithubOutlined,
  MediumOutlined,
} from '@ant-design/icons';
import { ReactComponent as DiscordSvg } from '../../assets/Discord.svg';
import { ReactComponent as TelegramSvg } from '../../assets/Telegram.svg';

const Footer = () => {
  return (
    <div className="Footer">
      <p style={{ textAlign: 'center' }}>
        © 2020{' '}
        <a href="https://tellor.io" rel="noopener noreferrer" target="_blank">
          Tellor.io
        </a>
      </p>
      <p>
        <a
          href="https://disputecenterv1.herokuapp.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          V1 Historical Data
        </a>
      </p>
      <div className="Footer__Links">
        <a
          href="https://twitter.com/wearetellor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <TwitterOutlined />
        </a>
        <a
          href="https://www.linkedin.com/company/tellorinc/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedinFilled />
        </a>
        <a
          href="https://www.youtube.com/channel/UCJteW6bsm1wn34i2hSAZBiw?view_as=subscriber"
          rel="noopener noreferrer"
          target="_blank"
        >
          <YoutubeFilled />
        </a>
        <a
          href="https://github.com/tellor-io/TellorCore"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubOutlined />
        </a>
        <a href="https://t.me/tellor" rel="noopener noreferrer" target="_blank">
          <Icon component={TelegramSvg} />
        </a>
        <a
          href="https://medium.com/tellor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <MediumOutlined />
        </a>
        <a
          href="https://discord.com/invite/n7drGjh"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon component={DiscordSvg} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
