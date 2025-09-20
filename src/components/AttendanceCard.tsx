import {
  Box,
  VStack,
  Flex,
  Heading,
  Tag,
  HStack,
  Icon,
  Text,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { Users, Calendar, FilePenLine, Trash2, Check } from 'lucide-react';
import { AttendanceStatus } from '../common/types/enums';

type Scout = {
  id: number;
  name: string;
};

type ListData = {
  id: string | number;
  createdAt: string;
  confirmedScouts: Scout[];
};

type AttendanceCardProps = {
  listData: ListData;
  status?: AttendanceStatus;
  onCardClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onConfirm?: () => void;
};

const AttendanceCard = ({
  listData,
  status,
  onCardClick,
  onEdit,
  onDelete,
  onConfirm,
}: AttendanceCardProps) => {
  const isPending = status === AttendanceStatus.InProgress;

  const formattedDate = new Date(listData.createdAt).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  );

  const presentCount = listData.confirmedScouts.length;

  const renderTag = () => {
    if (isPending) {
      return (
        <Tag colorScheme="yellow" size="sm">
          Em andamento
        </Tag>
      );
    }
    return (
      <Tag colorScheme="green" size="sm">
        Finalizada
      </Tag>
    );
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      height="100%"
      onClick={onCardClick}
      cursor="pointer"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" spacing={4} flex="1">
        <Flex justify="space-between" align="center">
          <Heading size="md">Lista de Presença</Heading>
          {renderTag()}
        </Flex>
        <VStack align="stretch" spacing={2}>
          <HStack color="gray.600">
            <Icon as={Calendar} boxSize={4} />
            <Text fontSize="sm">{formattedDate}</Text>
          </HStack>
          <HStack color="gray.600">
            <Icon as={Users} boxSize={4} />
            <Text fontSize="sm">{presentCount} presentes</Text>
          </HStack>
        </VStack>
      </VStack>

      {isPending && (
        <>
          <Divider my={3} />
          <HStack justify="flex-end" spacing={1}>
            <IconButton
              aria-label="Confirmar lista"
              icon={<Check size={20} />}
              colorScheme="green"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onConfirm?.();
              }}
            />
            <IconButton
              aria-label="Editar lista"
              icon={<FilePenLine size={20} />}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            />
            <IconButton
              aria-label="Deletar rascunho"
              icon={<Trash2 size={20} />}
              colorScheme="red"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            />
          </HStack>
        </>
      )}
    </Box>
  );
};

export default AttendanceCard;
