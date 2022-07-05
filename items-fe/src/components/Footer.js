import { useStoreState } from 'easy-peasy';
const Footer = () => {
  const today = new Date();
  const itemCount = useStoreState((state) => state.itemCount);
  return (
    <footer className="footer font-small">
      <p>
        {itemCount} items for sale - All Electronics (Copyright &copy;{' '}
        {today.getFullYear()})
      </p>
    </footer>
  );
};

export default Footer;
