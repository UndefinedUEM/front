import { Box, Flex } from '@chakra-ui/react';

import Footer from './Footer';
import type { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1" overflowY="auto">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default PageLayout;
