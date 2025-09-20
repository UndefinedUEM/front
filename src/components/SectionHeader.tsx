import { HStack, Heading } from '@chakra-ui/react';
import type { ElementType } from 'react';

type SectionHeaderProps = {
  title: string;
  icon: ElementType;
};

const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
  return (
    <HStack mb={6} justifyContent="center">
      {Icon && <Icon size={32} color="#319795" />}
      <Heading as="h1" size="xl">
        {title}
      </Heading>
    </HStack>
  );
};

export default SectionHeader;
